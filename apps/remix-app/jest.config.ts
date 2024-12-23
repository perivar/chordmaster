import { Config } from "@jest/types"

import { jestBaseConfig } from "../../jest.config.base";

const config: Config.InitialOptions = {
  ...jestBaseConfig,
  displayName: "remix-app", // Name for the Jest project
  roots: ["app"],
};

export default config;
