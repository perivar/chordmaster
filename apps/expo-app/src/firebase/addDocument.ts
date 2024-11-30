import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "./config";

const addDocument = (
  collectionName: string,
  documentObj: unknown[],
  id: string
) => {
  const docRef = doc(collection(db, collectionName), id);
  return setDoc(docRef, {
    ...documentObj,
    timestamp: serverTimestamp(),
  });
};

export default addDocument;
