import Constants from "expo-constants";
import { deleteObject, ref } from "firebase/storage";

import { storage } from "./config";

// see https://stackoverflow.com/questions/49945312/delete-a-file-from-firebase-storage-using-download-url-with-cloud-functions
const getPathStorageFromUrl = (url: string) => {
  const baseUrl = Constants?.expoConfig?.extra?.firebase?.storageBaseUrl;
  // e.g. 'https://firebasestorage.googleapis.com/v0/b/niftifiedapp.appspot.com/o/';

  let imagePath: string = url.replace(baseUrl, "");

  const indexOfEndPath = imagePath.indexOf("?");

  imagePath = imagePath.substring(0, indexOfEndPath);
  imagePath = imagePath.replace(/%2F/g, "/");
  imagePath = imagePath.replace(/%20/g, " ");
  imagePath = imagePath.replace(/%3D/g, "=");

  return imagePath;
};

export const deleteFileUsingUri = async (uri: string) => {
  const mediaFileName = getPathStorageFromUrl(uri);
  console.log("Trying to delete mediaFileName: ", mediaFileName);

  const storageRef = ref(storage, mediaFileName);

  deleteObject(storageRef)
    .then(() => {
      // File deleted successfully
      console.log("deleteFile - File deleted successfully!");
    })
    .catch(error => {
      console.log("deleteFile - Unsuccessful delete:", error);
    });
};
