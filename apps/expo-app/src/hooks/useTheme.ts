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
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// below this is exported as the interface Theme
export const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...LightTheme,

  colors: {
    ...PaperDefaultTheme.colors,
    ...LightTheme.colors,

    //#region Color Description
    // React Navigation Colors:
    // primary (string): The primary color of the app used to tint various elements. Usually you'll want to use your brand color for this.
    // background (string): The color of various backgrounds, such as background color for the screens.
    // card (string): The background color of card-like elements, such as headers, tab bars etc.
    // text (string): The text color of various elements.
    // border (string): The color of borders, e.g. header border, tab bar border etc.
    // notification (string): The color of Tab Navigator badge.

    // Defaults from adaptNavigationTheme():
    // primary: MD3Theme.colors.primary,
    // background: MD3Theme.colors.background,
    // card: MD3Theme.colors.elevation.level2,
    // text: MD3Theme.colors.onSurface,
    // border: MD3Theme.colors.outline,
    // notification: MD3Theme.colors.error,

    // React Native Paper Material Colors:
    // primary,
    // primaryContainer,
    // secondary,
    // secondaryContainer,
    // tertiary,
    // tertiaryContainer,
    // surface,
    // surfaceVariant,
    // surfaceDisabled,
    // background,
    // error,
    // errorContainer,
    // onPrimary,
    // onPrimaryContainer,
    // onSecondary,
    // onSecondaryContainer,
    // onTertiary,
    // onTertiaryContainer,
    // onSurface,
    // onSurfaceVariant,
    // onSurfaceDisabled,
    // onError,
    // onErrorContainer,
    // onBackground,
    // outline,
    // shadow,
    // inverseOnSurface,
    // inverseSurface,
    // inversePrimary,
    // backdrop,
    // #endregion

    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.blue,
    // error: COLORS.error,
    background: COLORS.white2,
    onBackground: COLORS.primary,

    // bottom tabs
    onSurface: COLORS.blue,
    card: COLORS.white2,

    // side menu and tab
    primaryContainer: COLORS.lightGray2, // side menu and inactive tab
    secondaryContainer: COLORS.blue, // active
    onPrimary: COLORS.white2, // button text
    onPrimaryContainer: COLORS.darkGray,
    onSecondaryContainer: COLORS.white2,
    onSurfaceDisabled: COLORS.gray,
  },
};

// set the CombinedAppTheme interface to whatever we define in the CombinedDefaultTheme,
// so that the alternative dark theme mode requires a duplicate set
export type CombinedAppTheme = typeof CombinedDefaultTheme;

export const CombinedDarkTheme: CombinedAppTheme = {
  ...PaperDarkTheme,
  ...DarkTheme,

  colors: {
    ...PaperDarkTheme.colors,
    ...DarkTheme.colors,

    primary: COLORS.lightGray,
    secondary: COLORS.gray1,
    tertiary: COLORS.lightBlue,
    // error: COLORS.error,
    background: COLORS.black,
    onBackground: COLORS.white2,

    // bottom tabs
    onSurface: COLORS.lightBlue,
    card: COLORS.primary,

    // side menu and tab
    primaryContainer: COLORS.darkGray, // side menu and inactive tab
    secondaryContainer: COLORS.blue, // active
    onPrimary: COLORS.darkGray2, // button text
    onPrimaryContainer: COLORS.white2,
    onSecondaryContainer: COLORS.white2,
    onSurfaceDisabled: COLORS.gray,
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
