#!/usr/bin/env node

// To run
// pnpm --filter node-cli run build && node ./apps/node-cli/build/index.js

// pnpm --filter node-cli run build && node ./apps/node-cli/build/index.js add -d '/Users/per.nerseth/projects/Christmas-Songs' --all
// or
// pnpm --filter node-cli run build && node ./apps/node-cli/build/index.js list --all

// or ultimate guitar commands (in the node-cli dir)
// pnpm --filter node-cli run build && node ./build/index.js ug -v -j "ugexamples.json"
// pnpm --filter node-cli run build && node ./build/index.js ug -v -l
// pnpm --filter node-cli run build && node ./build/index.js ug -v -d

// or backup commands
// pnpm --filter node-cli run build && node ./apps/node-cli/build/index.js backup -a
// or
// pnpm --filter node-cli run build
// pnpm --filter node-cli run link
// chordmaster backup -a
// pnpm --filter node-cli run unlink
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // Required for modern yargs parsing

import * as add from "./add";
import * as backup from "./backup";
import * as list from "./list";
import * as remove from "./remove";
import * as ug from "./ug";

yargs(hideBin(process.argv))
  .scriptName("cli") // Set the script name
  .usage("Usage: $0 <cmd> [options]") // Usage information
  .alias("h", "help") // Alias for help
  .help("help") // Enable help
  .showHelpOnFail(true, "Specify --help or -h for available options.") // Show help message on failure
  .strict() // Enforce strict parsing
  .demandCommand(1, "No command given, see usage.") // Require at least one command
  .command(add) // Register `add` command
  .command(remove) // Register `remove` command
  .command(list) // Register `list` command
  .command(ug) // Register `ug` command
  .command(backup) // Register `backup` command
  .parse(); // Parse arguments
