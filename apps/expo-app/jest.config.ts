import type { Config } from "jest";

// By default, all files inside `node_modules` are not transformed. But some 3rd party
// modules are published as untranspiled, Jest will not understand the code in these modules.
// To overcome this, exclude these modules in the ignore pattern.
const untranspiledModulePatterns = [
  "(jest-)?react-native",
  "@react-native-community",
  "expo(nent)?",
  "@expo(nent)?/.*",
  "react-navigation",
  "@react-navigation/.*",
  "@unimodules/.*",
  "unimodules",
  "sentry-expo",
  "native-base",
  "react-native-svg",
  "chord-symbol",
];

// const config: Config.InitialOptions = {
//   preset: 'jest-expo',
//   transformIgnorePatterns: [
//     `node_modules/(?!${untranspiledModulePatterns.join('|')})`,
//   ],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
// };

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  transform: {
    "\\.[jt]sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  testRegex: "/__tests__/.*.test.ts$",
  transformIgnorePatterns: [
    `node_modules/(?!${untranspiledModulePatterns.join("|")})`,
  ],
  verbose: true,
};

export default config;
