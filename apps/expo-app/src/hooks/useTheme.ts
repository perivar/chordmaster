import { useContext } from "react";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  adaptNavigationTheme,
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

import { COLORS } from "../constants/theme";
import {
  ThemeContext,
  ThemeContextInterface,
  ThemeType,
} from "../context/ThemeProvider";

// using both navigation and react paper theme:
// https://callstack.github.io/react-native-paper/theming-with-react-navigation.html
// https://github.com/callstack/react-native-paper/blob/main/example/src/index.tsx
// https://hemanshum.medium.com/the-ultimate-guide-to-custom-theming-with-react-native-paper-expo-and-expo-router-8eba14adcab3
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// below this is exported as the interface Theme
export const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...LightTheme,

  fonts: {
    // react-native-paper
    ...PaperDefaultTheme.fonts,
    bodySmall: PaperDefaultTheme.fonts.bodySmall,
    bodyMedium: PaperDefaultTheme.fonts.bodyMedium,
    bodyLarge: PaperDefaultTheme.fonts.bodyLarge,

    // react-navigation
    regular: NavigationDefaultTheme.fonts.regular,
    medium: NavigationDefaultTheme.fonts.medium,
    bold: NavigationDefaultTheme.fonts.bold,
    heavy: NavigationDefaultTheme.fonts.heavy,
  },

  colors: {
    ...PaperDefaultTheme.colors,
    ...LightTheme.colors,
    ...COLORS.light,
  },
};

// set the CombinedAppTheme interface to whatever we define in the CombinedDefaultTheme,
// so that the alternative dark theme mode requires a duplicate set
export type CombinedAppTheme = typeof CombinedDefaultTheme;

export const CombinedDarkTheme: CombinedAppTheme = {
  ...PaperDarkTheme,
  ...DarkTheme,

  fonts: {
    // react-native-paper
    ...PaperDarkTheme.fonts,
    bodySmall: PaperDarkTheme.fonts.bodySmall,
    bodyMedium: PaperDarkTheme.fonts.bodyMedium,
    bodyLarge: PaperDarkTheme.fonts.bodyLarge,

    // react-navigation
    regular: NavigationDarkTheme.fonts.regular,
    medium: NavigationDarkTheme.fonts.medium,
    bold: NavigationDarkTheme.fonts.bold,
    heavy: NavigationDarkTheme.fonts.heavy,
  },

  colors: {
    ...PaperDarkTheme.colors,
    ...DarkTheme.colors,
    ...COLORS.dark,
  },
};

interface UseThemeHook extends ThemeContextInterface {
  dark: boolean;
  theme: CombinedAppTheme;
}

const useTheme = (): UseThemeHook => {
  const { themeMode, setThemeMode, toggleThemeMode } =
    useContext(ThemeContext)!;

  return {
    dark: themeMode === ThemeType.DARK,
    theme:
      themeMode === ThemeType.DARK ? CombinedDarkTheme : CombinedDefaultTheme,
    themeMode,
    setThemeMode,
    toggleThemeMode,
  };
};

export { useTheme };
