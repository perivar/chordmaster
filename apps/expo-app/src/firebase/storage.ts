import AsyncStorage from "@react-native-async-storage/async-storage";

// After login Auth UID
const AUTH_UID_KEY = "AUTH_UID" as const;
// Auth id token
const AUTH_ID_TOKEN_KEY = "AUTH_ID_TOKEN" as const;
// Auth id token Deadline
const AUTH_ID_TOKEN_EXPIRATION_KEY = "AUTH_ID_TOKEN_EXPIRATION" as const;

// Used by Theme Provider
const THEME_KEY = "THEME_KEY" as const;

// Used by Localization Provider
const LOCALE_KEY = "LOCALE_KEY" as const;

export const storageKey = {
  AUTH_UID_KEY,
  AUTH_ID_TOKEN_KEY,
  AUTH_ID_TOKEN_EXPIRATION_KEY,
  THEME_KEY,
  LOCALE_KEY,
} as const;

type StorageKey = typeof storageKey;
type StorageKeys = keyof StorageKey;
type StorageValues = StorageKey[StorageKeys];

export const getItem = async (key: StorageValues): Promise<string | null> => {
  try {
    const item = await AsyncStorage.getItem(key);

    return item;
  } catch {
    return null;
  }
};

export const setItem = async (
  key: StorageValues,
  data: string
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, data);

    return true;
  } catch {
    return false;
  }
};

export const removeItem = async (key: StorageValues): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
};
