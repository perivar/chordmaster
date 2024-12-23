import type { Config } from "jest";

import baseConfig from "../../jest.config.base";

const config: Config = {
  ...baseConfig,
  displayName: "node-cli", // Name for the Jest project
  roots: ["src"],
};

export default config;
