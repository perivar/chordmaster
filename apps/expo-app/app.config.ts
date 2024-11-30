// the dotenv/config will read your .env file
// and merge it with process.env data
// This is just for the builds that happen outside of eas
import "dotenv/config";

import { ConfigContext, ExpoConfig } from "@expo/config";

const usesEmailSignIn =
  process.env.USES_EMAIL_SIGN_IN === "true" ? true : false;
const usesAppleSignIn =
  process.env.USES_APPLE_SIGN_IN === "true" ? true : false;
const usesGoogleSignIn =
  process.env.USES_GOOGLE_SIGN_IN === "true" ? true : false;
const usesFacebookSignIn =
  process.env.USES_FACEBOOK_SIGN_IN === "true" ? true : false;

const VERSION = "1.0.6";
const BUILD_NUMBER = 2;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ChordMaster",
  slug: "chordmaster",
  scheme: "chordmaster",
  owner: "perivar",
  version: VERSION,
  currentFullName: "@perivar/chordmaster",
  originalFullName: "@perivar/chordmaster",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#004aac",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/60bae21e-e73c-4ce6-b53a-5de1519573c2",
  },
  assetBundlePatterns: ["**/*"],
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nerseth.chordmaster",
    buildNumber: BUILD_NUMBER.toString(),
    // https://github.com/expo/expo/tree/master/packages/expo-document-picker#plugin
    usesIcloudStorage: true,
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.nerseth.chordmaster",
    versionCode: BUILD_NUMBER,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    [
      // https://github.com/expo/eas-cli/issues/693#issuecomment-1095229385
      "expo-document-picker",
      {
        appleTeamId: "422RN2737A",
        iCloudContainerEnvironment: "Production",
      },
    ],
  ],
  extra: {
    // the secrets created with eas secret:create will
    // be merged with process.env during eas builds
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.FIREBASE_APP_ID || "",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
      storageBaseUrl: process.env.FIREBASE_STORAGE_BASE_URL || "",
      apiBaseUrl: process.env.FIREBASE_API_BASE_URL || "",
    },
    appConfigDocId: process.env.APP_CONFIG_DOC_ID || "",
    usesEmailSignIn: usesEmailSignIn,
    usesAppleSignIn: usesAppleSignIn,
    usesGoogleSignIn: usesGoogleSignIn,
    usesFacebookSignIn: usesFacebookSignIn,
    expoGoogleClientId: process.env.EXPO_GOOGLE_CLIENT_ID || "",
    expoFacebookClientId: process.env.EXPO_FACEBOOK_CLIENT_ID || "",
    iosGoogleClientId: process.env.IOS_GOOGLE_CLIENT_ID || "",
    androidGoogleClientId: process.env.ANDROID_GOOGLE_CLIENT_ID || "",
    googleMapsCredentials: process.env.GOOGLEMAPS_CREDENTIAL || "",
    eas: {
      projectId: "60bae21e-e73c-4ce6-b53a-5de1519573c2",
    },
  },
});
