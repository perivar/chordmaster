import admin from "firebase-admin";

// Get a reference to the database service
const db = admin.firestore();

//  @see https://github.com/firebase/snippets-node/blob/master/firestore/main/index.js
export const deleteCollection = async (
  collectionPath: string,
  batchSize: number
) => {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise<boolean>((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
};

const deleteQueryBatch = async (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: (value: boolean) => void
) => {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(true);
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
};
