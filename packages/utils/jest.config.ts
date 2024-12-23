import { Config } from "@jest/types";

import { jestBaseConfig } from "../../jest.config.base";

const config: Config.InitialOptions = {
  ...jestBaseConfig,
  displayName: "@chordmaster/utils", // Name for the Jest project
  roots: ["src"],
};

export default config;
