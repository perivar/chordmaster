import { deleteDoc, doc } from "firebase/firestore";

import { db } from "./config";

const deleteDocument = (collectionName: string, documentId: string) => {
  return deleteDoc(doc(db, collectionName, documentId));
};

export default deleteDocument;
