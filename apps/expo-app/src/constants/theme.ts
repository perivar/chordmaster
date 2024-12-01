import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  light: {
    primary: "#1E1E1E",
    onPrimary: "#FBFBFB", // button text
    primaryContainer: "#F5F5F8", // side menu and inactive tab
    onPrimaryContainer: "#212125",
    secondary: "#3B3B3B",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "#0064C0", // active
    onSecondaryContainer: "#FBFBFB",
    tertiary: "#0064C0",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 223, 160)",
    onTertiaryContainer: "rgb(38, 26, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "#FBFBFB",
    onBackground: "#1E1E1E",
    surface: "rgb(255, 251, 255)",
    onSurface: "#0064C0",
    surfaceVariant: "rgb(245, 222, 216)",
    onSurfaceVariant: "rgb(83, 67, 63)",
    outline: "rgb(133, 115, 110)",
    outlineVariant: "rgb(216, 194, 188)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 45)",
    inverseOnSurface: "rgb(251, 238, 235)",
    inversePrimary: "rgb(255, 181, 160)",
    elevation: {
      level0: "transparent",
      level1: "rgb(251, 241, 242)",
      level2: "rgb(249, 235, 235)",
      level3: "rgb(246, 229, 227)",
      level4: "rgb(246, 226, 224)",
      level5: "rgb(244, 222, 219)",
    },
    surfaceDisabled: "rgba(32, 26, 24, 0.12)",
    onSurfaceDisabled: "#898989",
    backdrop: "rgba(59, 45, 41, 0.4)",
  },
  dark: {
    primary: "#dbdbdb",
    onPrimary: "#3B3B3B", // button text
    primaryContainer: "#212125", // side menu and inactive tab
    onPrimaryContainer: "#FBFBFB",
    secondary: "#999999",
    onSecondary: "rgb(0, 51, 83)",
    secondaryContainer: "#0064C0", // active
    onSecondaryContainer: "#FBFBFB",
    tertiary: "#00bbff",
    onTertiary: "rgb(64, 45, 0)",
    tertiaryContainer: "rgb(92, 67, 0)",
    onTertiaryContainer: "rgb(255, 223, 160)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "#000000",
    onBackground: "#FBFBFB",
    surface: "rgb(32, 26, 24)",
    onSurface: "#00bbff",
    surfaceVariant: "rgb(83, 67, 63)",
    onSurfaceVariant: "rgb(216, 194, 188)",
    outline: "rgb(160, 140, 135)",
    outlineVariant: "rgb(83, 67, 63)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(237, 224, 221)",
    inverseOnSurface: "rgb(54, 47, 45)",
    inversePrimary: "rgb(176, 46, 0)",
    elevation: {
      level0: "transparent",
      level1: "rgb(43, 34, 31)",
      level2: "rgb(50, 38, 35)",
      level3: "rgb(57, 43, 39)",
      level4: "rgb(59, 45, 40)",
      level5: "rgb(63, 48, 43)",
    },
    surfaceDisabled: "rgba(237, 224, 221, 0.12)",
    onSurfaceDisabled: "#898989",
    backdrop: "rgba(59, 45, 41, 0.4)",
  },
};

export const SIZES = {
  // global sizes
  min: 6,
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: "Poppins-Black", fontSize: SIZES.largeTitle },
  h1: { fontFamily: "Poppins-Bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "Poppins-Bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h5, lineHeight: 22 },
  body1: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
