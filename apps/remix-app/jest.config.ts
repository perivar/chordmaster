import { Config } from "@jest/types";

import { jestBaseConfig } from "../../jest.config.base";

const config: Config.InitialOptions = {
  ...jestBaseConfig,
  testEnvironment: "jsdom",
  displayName: "remix-app", // Name for the Jest project
  roots: ["app"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
};

export default config;
