import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { StatusBar } from "expo-status-bar";

import useColorScheme from "../hooks/useColorScheme";

import { getItem, setItem, storageKey } from "../firebase/storage";

export type ThemeMode = "light" | "dark";
export enum ThemeType {
  LIGHT = "light",
  DARK = "dark",
}

export interface ThemeContextInterface {
  themeMode: ThemeMode;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextInterface | null>(null);

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();

  // default theme to the system
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    colorScheme ?? ThemeType.DARK
  );

  // Toggle between dark and light modes
  const toggleThemeMode = () => {
    setThemeMode(
      themeMode === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK
    );
  };

  // fetch locally cached theme on startup
  useEffect(() => {
    const fetchTheme = async () => {
      const localTheme = await getItem(storageKey.THEME_KEY);
      return localTheme;
    };

    fetchTheme().then(localTheme => {
      // console.log('Fetched localTheme:', localTheme);
      if (localTheme === ThemeType.DARK || localTheme === ThemeType.LIGHT) {
        setThemeMode(localTheme);
      }
    });
  }, []);

  // set new theme to local storage
  useEffect(() => {
    // console.log('Storing theme to local storage:', theme);
    setItem(storageKey.THEME_KEY, themeMode);
  }, [themeMode]);

  // check if the phone color scheme has changed?
  useEffect(() => {
    if (colorScheme) {
      // console.log(
      //   'Color scheme changed, setting theme and updating current scheme:',
      //   theme
      // );
      setThemeMode(colorScheme);
    }
  }, [colorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleThemeMode,
      }}>
      {children}
      <StatusBar
        style={themeMode === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK}
      />
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
