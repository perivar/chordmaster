import type { Config } from "jest";

import baseConfig from "../../jest.config.base";

const config: Config = {
  ...baseConfig,
  displayName: "remix-app", // Name for the Jest project
  roots: ["app"],
};

export default config;
