import baseConfig, { untranspiledModulePatterns } from "../../jest.config.base";

const remixAppDir = "./";

const config = {
  ...baseConfig,
  displayName: "remix-app", // Name for the Jest project
  rootDir: `${remixAppDir}`,
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      { tsconfig: `${remixAppDir}/tsconfig.json`, isolatedModules: true },
    ],
  },
  transformIgnorePatterns: [
    `${remixAppDir}/node_modules/(?!(${untranspiledModulePatterns.join("|")})/)`,
  ],
  testRegex: "/__tests__/.*.(spec|test).ts$",
};

export default config;
