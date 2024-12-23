import baseConfig, { untranspiledModulePatterns } from './jest.config.base';

// Define reusable paths
const remixAppDir = "<rootDir>/apps/remix-app";
const expoAppDir = "<rootDir>/apps/expo-app";
const nodeCliDir = "<rootDir>/apps/node-cli";
const sharedUtilsDir = "<rootDir>/packages/utils";

const config = {
  projects: [
    {
      ...baseConfig,
      displayName: "@chordmaster/utils",
      roots: [`${sharedUtilsDir}`],
      // had to add isolatedModules: true to make sure the jest tests did not take forever to start
      // https://github.com/jestjs/jest/issues/10833
      transform: {
        "\\.[jt]sx?$": ["ts-jest", { tsconfig: `${sharedUtilsDir}/tsconfig.json`, isolatedModules: true }],
      },
    },
    {
      ...baseConfig,
      displayName: "remix-app",
      roots: [`${remixAppDir}`],
      // had to add isolatedModules: true to make sure the jest tests did not take forever to start
      // https://github.com/jestjs/jest/issues/10833
      transform: {
        "\\.[jt]sx?$": ["ts-jest", { tsconfig: `${remixAppDir}/tsconfig.json`, isolatedModules: true }],
      },
    },
    {
      ...baseConfig,
      displayName: "expo-app",
      roots: [`${expoAppDir}`],
      transform: {
        // had to add isolatedModules: true to make sure the jest tests did not take forever to start
        // https://github.com/jestjs/jest/issues/10833
        "\\.[jt]sx?$": ["ts-jest", { tsconfig: `${expoAppDir}/tsconfig.json`, isolatedModules: true }],
      },
    },
    {
      ...baseConfig,
      displayName: "node-cli",
      roots: [`${nodeCliDir}`],
      // had to add isolatedModules: true to make sure the jest tests did not take forever to start
      // https://github.com/jestjs/jest/issues/10833
      transform: {
        "\\.[jt]sx?$": ["ts-jest", { tsconfig: `${nodeCliDir}/tsconfig.json`, isolatedModules: true }],
      },
    }
  ]
};

export default config;



