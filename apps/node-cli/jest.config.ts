import baseConfig, { untranspiledModulePatterns } from "../../jest.config.base";

const nodeCliDir = "./";

const config = {
  ...baseConfig,
  displayName: "node-cli", // Name for the Jest project
  rootDir: `${nodeCliDir}`,
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      { tsconfig: `${nodeCliDir}/tsconfig.json`, isolatedModules: true },
    ],
  },
  transformIgnorePatterns: [
    `${nodeCliDir}/node_modules/(?!(${untranspiledModulePatterns.join("|")})/)`,
  ],
  testRegex: "/__tests__/.*.(spec|test).ts$",
};

export default config;
