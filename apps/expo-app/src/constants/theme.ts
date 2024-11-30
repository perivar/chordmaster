import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#1E1E1E",
  secondary: "#3B3B3B",
  error: "#D84035",

  transparentPrimary: "rgba(0, 0, 0, 0.5)",

  white: "#FFFFFF",
  white2: "#FBFBFB",
  black: "#000000",
  orange: "#FFA133",
  lightOrange: "#FFA133",
  lightOrange2: "#FDDED4",
  lightOrange3: "#FFD9AD",
  green: "rgba(48, 191, 71, 1.0)",
  lightGreen: "#4BEE70",
  darkGreen: "#005500",
  darkGreen1: "#008800",
  darkGreen2: "#009900",
  red: "#D84035",
  red2: "#FF4035",
  blue: "#0064C0",
  lightBlue: "#00bbff",
  darkBlue: "#111A2C",
  darkGray: "#212125",
  darkGray2: "#3B3B3B",
  darkGray3: "#757575",
  darkGray4: "#444444",
  gray: "#898989",
  gray1: "#999999",
  gray2: "#BBBBBB",
  gray3: "#CFD0D7",
  lightGray: "#dbdbdb",
  lightGray1: "#DDDDDD",
  lightGray2: "#F5F5F8",
  lightGray3: "#757575",

  transparent: "transparent",
  transparentWhite: "rgba(255, 255, 255, 0.2)",
  transparentWhite1: "rgba(255, 255, 255, 0.2)",
  transparentWhite2: "rgba(255, 255, 255, 0.4)",
  transparentWhite3: "rgba(255, 255, 255, 0.5)",
  transparentWhite4: "rgba(255, 255, 255, 0.6)",
  transparentWhite5: "rgba(255, 255, 255, 0.7)",
  transparentWhite6: "rgba(255, 255, 255, 0.8)",
  transparentBlack: "rgba(0, 0, 0, 0.8)",
  transparentBlack1: "rgba(0, 0, 0, 0.2)",
  transparentBlack2: "rgba(0, 0, 0, 0.4)",
  transparentBlack3: "rgba(0, 0, 0, 0.5)",
  transparentBlack4: "rgba(0, 0, 0, 0.6)",
  transparentBlack5: "rgba(0, 0, 0, 0.7)",
  transparentBlack6: "rgba(0, 0, 0, 0.8)",
  transparentDarkBlue: "rgba(17, 26, 44, 0.5)",

  slate: "#0A2540",
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
// export const FONTS = {
//   largeTitle: { fontFamily: 'Roboto-Black', fontSize: SIZES.largeTitle },
//   h1: { fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36 },
//   h2: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30 },
//   h3: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22 },
//   h4: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22 },
//   h5: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h5, lineHeight: 22 },
//   body1: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: SIZES.body1,
//     lineHeight: 36,
//   },
//   body2: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: SIZES.body2,
//     lineHeight: 30,
//   },
//   body3: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: SIZES.body3,
//     lineHeight: 22,
//   },
//   body4: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: SIZES.body4,
//     lineHeight: 22,
//   },
//   body5: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: SIZES.body5,
//     lineHeight: 22,
//   },
// };

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
