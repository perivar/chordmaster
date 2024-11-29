import chalk from "chalk";
import { Arguments, Argv } from "yargs";

import { removeSongs } from "./songMethods";

const errorStyle = chalk.bold.red;
const warningStyle = chalk.hex("#FFA500").bold; // orange
const successStyle = chalk.bold.green;

interface Args {
  all: boolean | undefined;
  name: string | undefined;
  verbose: boolean | undefined;
}

const EXTERNAL_SOURCE = "Public Domain Christmas Songs";

export const command = "remove [options]";
export const describe = "Remove songs from the firestore database";

export const builder = (yargs: Argv): Argv<Args> => {
  return yargs
    .option("all", {
      alias: "a",
      describe:
        "Delete all chord files previously added using cli from firestore",
      type: "boolean",
    })
    .option("name", {
      alias: "n",
      describe:
        "Only delete chord files previously added using cli that starts with the query",
      type: "string",
    })
    .option("verbose", {
      alias: "v",
      description: "Run with verbose logging",
      type: "boolean",
    })
    .example(
      "$0 remove -a",
      "Delete all chord files previously added using cli from firestore"
    )
    .example(
      '$0 remove -n "realm"',
      'Delete only the chord files previously added using cli starting with the word "realm" from firestore'
    )
    .example("$0 remove --help", "Show help")
    .check((argv: Arguments<Args>) => {
      if (!argv.all && !argv.name) {
        throw new Error("You must supply either --all or --name");
      } else {
        return true;
      }
    });
};

export const handler = async (argv: Arguments<Args>): Promise<void> => {
  // process arguments using yarg
  let isVerbose = false;
  let doRemove = false;
  let nameQuery = undefined;

  if (argv.verbose) {
    console.info(warningStyle("Verbose mode on."));
    isVerbose = true;
  }

  if (argv.all) {
    console.info(
      successStyle(
        "--all argument found. Trying to delete all chord files previously added by this cli ..."
      )
    );
    doRemove = true;
  } else if (argv.name) {
    nameQuery = argv.name;
    console.info(
      successStyle(
        `--name argument found. Trying to delete only the chord files added using cli starting with ${nameQuery} ...`
      )
    );
    doRemove = true;
  } else {
    console.info(
      warningStyle(
        "Neither --name or --all arguments found. Use --help for more information."
      )
    );
    doRemove = false;
  }

  if (doRemove) {
    removeSongs(EXTERNAL_SOURCE, nameQuery, isVerbose)
      .then(res => console.log(successStyle(res)))
      .catch(err => console.log(errorStyle(err)));
  }
};
