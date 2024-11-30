import { useState } from "react";

import { convertImageToBlob, timeout } from "@chordmaster/utils";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
} from "firebase/storage";

import { debug } from "../utils/debug";

import { storage } from "../firebase/config";

const getPercentage = (ratio: number) => Math.round(ratio * 100);

const getFileBlob = async (uri: string) => {
  // const localUri = await fetch(uri);
  // const localBlob = await localUri.blob();

  // convert to blob
  const localBlob = await convertImageToBlob(uri);

  return localBlob;
};

const createStorageReferenceToFile = (
  path: string,
  uri: string,
  id?: string
): StorageReference => {
  const fileNameArray = uri.split("/");
  const filename = fileNameArray[fileNameArray.length - 1];
  const mediaFileName = id
    ? `${path}/${id}/${filename}`
    : `${path}/${filename}`;

  // const filename = new Date().getTime();
  // const mediaFileName = `${path}/${id}_${filename}`;

  debug("uploading mediaFileName: ", mediaFileName);

  return ref(storage, mediaFileName);
};

// Can be used like this:
// const [{ downloadURL, uploading, progress }, monitorUpload] = useFirebaseUpload();
// @see https://github.com/yhenni1989/jarvis/blob/master/src/components/UploadFile.js
export const useFirebaseUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const monitorUpload = async (path: string, uri: string, id?: string) => {
    setSuccess(false);
    setProgress(0);

    if (!uri) {
      debug("uri is empty!");
      setError(new Error("Uri is empty"));
      return;
    }

    setUploading(true);
    setError(null);

    const storageRef = createStorageReferenceToFile(path, uri, id);
    const localBlob = await getFileBlob(uri);
    const uploadTask = uploadBytesResumable(storageRef, localBlob);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      taskSnapshot => {
        // Observe state change events such as progress
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const fileProgress = getPercentage(
          taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
        );
        debug("Upload is " + fileProgress + "% done");

        setProgress(fileProgress);
      },
      err => {
        // Handle unsuccessful uploads
        console.error("Unsuccessful upload:", err);
        setError(err);
      },
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        // localBlob.close();

        const downloadURLResult = await getDownloadURL(uploadTask.snapshot.ref);
        debug("File available at", downloadURLResult);

        timeout(() => {
          setSuccess(true);
          setUploading(false);
          setProgress(0);
          setDownloadURL(downloadURLResult);
        }, 1000);
      }
    );
  };

  const state = {
    progress,
    uploading,
    downloadURL,
    success,
    error,
  };

  return [state, monitorUpload] as const;
};
