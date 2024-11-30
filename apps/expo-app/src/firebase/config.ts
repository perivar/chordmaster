// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { LogBox } from "react-native";

//@ts-expect-error getReactNativePersistence missing
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import {
  CACHE_SIZE_UNLIMITED,
  FirestoreSettings,
  getFirestore,
  initializeFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

LogBox.ignoreLogs(["firebase/firestore:"]);

// Ignore firebase v9 AsyncStorage warning
LogBox.ignoreLogs([/AsyncStorage has been extracted from .*/]);

// read firebase config from app config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebase?.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebase?.authDomain,
  projectId: Constants.expoConfig?.extra?.firebase?.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebase?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebase?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebase?.appId,
  measurementId: Constants.expoConfig?.extra?.firebase?.measurementId,
};

// Initialize Firebase
console.log("initializing firebase app: " + JSON.stringify(firebaseConfig));
// console.log('Initializing firebase app');

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

initializeFirestore(app, {
  useFetchStreams: false,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
} as FirestoreSettings);

export const storage = getStorage();
export const db = getFirestore();
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
