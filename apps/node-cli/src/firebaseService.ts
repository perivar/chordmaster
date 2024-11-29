import admin from "firebase-admin";

// Import keys and user
import serviceAccount from "./serviceAccountKey.json";

// Function to initialize Firebase
export const initializeFirebaseApp = () => {
  console.log("Initializing firebase service for " + serviceAccount.project_id);

  // Ensure `admin` is defined
  if (!admin || !admin.apps) {
    throw new Error(
      "Firebase Admin SDK is not properly imported or initialized."
    );
  }

  // Check if the app is already initialized, and initialize if necessary
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  // Return the default app if already initialized
  return admin.app();
};

// Initialize Firebase app and services
const app = initializeFirebaseApp();
export const db = admin.firestore(app);
