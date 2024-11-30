import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { debug } from "../utils/debug";

import { db } from "./config";
import deleteDocument from "./deleteDocument";
import deleteFile from "./deleteFile";

const deleteUserFiles = (
  collectionName: string,
  currentUser: User,
  uidField = "uid"
) => {
  return new Promise(async (resolve, reject) => {
    const q = query(
      collection(db, collectionName),
      where(uidField, "==", currentUser.uid)
    );
    try {
      const snapshot = await getDocs(q);
      debug(`Found ${snapshot.size} documents in ${collectionName} to delete!`);

      const storePromises: Promise<void>[] = [];
      const storagePromises: Promise<void>[] = [];

      snapshot.forEach(document => {
        storePromises.push(deleteDocument(collectionName, document.id));
        storagePromises.push(
          deleteFile(`${collectionName}/${currentUser.uid}/${document.id}`)
        );
      });

      await Promise.all(storePromises);

      // these might not exist, so ignore errors
      try {
        await Promise.all(storagePromises);
      } catch (_error) {}

      if (currentUser?.photoURL) {
        const photoName = currentUser?.photoURL
          ?.split(`${currentUser.uid}%2F`)[1]
          ?.split("?")[0];
        if (photoName) {
          try {
            await deleteFile(`profile/${currentUser.uid}/${photoName}`);
          } catch (error) {
            console.log(error);
          }
        }
      }

      resolve(`${collectionName}/${currentUser.uid}/`);
    } catch (error) {
      reject(error);
    }
  });
};

export default deleteUserFiles;
