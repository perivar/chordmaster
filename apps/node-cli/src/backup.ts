import fs from "fs";
import path from "path";

import chalk from "chalk";
import { Arguments, Argv } from "yargs";

import { db } from "./firebaseService";
import personalUser from "./personalUser.json";
import { ISong, IUser } from "./types";

const errorStyle = chalk.bold.red;
const warningStyle = chalk.hex("#FFA500").bold; // orange
const successStyle = chalk.bold.green;

interface Args {
  all: boolean | undefined;
  name: string | undefined;
  verbose: boolean | undefined;
}

// set user from imported json
const user = personalUser as IUser;

export const command = "backup [options]";
export const describe = "Backup songs from the firestore database";

export const builder = (yargs: Argv): Argv<Args> => {
  return yargs
    .option("all", {
      alias: "a",
      describe: "Backup all chord files from firestore",
      type: "boolean",
    })
    .option("name", {
      alias: "n",
      describe: "Only backup chord files that starts with the query",
      type: "string",
    })
    .option("verbose", {
      alias: "v",
      description: "Run with verbose logging",
      type: "boolean",
    })
    .example("$0 backup -a", "Backup all chord files")
    .example(
      '$0 backup -n "realm"',
      'Backup only the chord files starting with the word "realm" from firestore'
    )
    .example("$0 backup --help", "Show help")
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
  let doBackup = false;
  let nameQuery = undefined;

  if (argv.verbose) {
    console.info(warningStyle("Verbose mode on."));
    isVerbose = true;
  }

  if (argv.all) {
    console.info(
      successStyle("--all argument found. Trying to backup all chord files ...")
    );
    doBackup = true;
  } else if (argv.name) {
    nameQuery = argv.name;
    console.info(
      successStyle(
        `--name argument found. Trying to backup only the chord files starting with ${nameQuery} ...`
      )
    );
    doBackup = true;
  } else {
    console.info(
      warningStyle(
        "Neither --name or --all arguments found. Use --help for more information."
      )
    );
    doBackup = false;
  }

  if (doBackup) {
    backupSongsByUser(user, nameQuery, isVerbose)
      .then(res => console.log(successStyle(res)))
      .catch(err => console.log(errorStyle(err)));
  }
};

export const backupSongsByUser = async (
  usr: IUser,
  nameQuery: string | undefined,
  isVerbose: boolean
) => {
  if (!usr || !usr.uid) throw new Error("invalid_user");

  let songsQuery = db.collection("songs").where("user.uid", "==", usr.uid);

  if (isVerbose) {
    console.log(`'Limiting query to user == '${JSON.stringify(usr, null, 2)}'`);
  }

  if (nameQuery && nameQuery !== "") {
    songsQuery = songsQuery
      .where("title", ">=", nameQuery)
      .where("title", "<=", nameQuery + "\uf8ff");

    if (isVerbose) {
      console.log(`'Limiting query to title that starts with '${nameQuery}'`);
    }
  }

  const songsSnapshots = await songsQuery.get();

  if (songsSnapshots.size > 0) {
    console.log(successStyle(`Found ${songsSnapshots.size} Songs ...`));

    songsSnapshots.forEach(songsSnapshot => {
      const data = songsSnapshot.data() as ISong;

      console.log(
        warningStyle(`Backing up song with title "${data.title}" ...`)
      );

      let fileName = data.title;
      fileName = fileName.replace(/([^a-z0-9æøå]+)/gi, "-");
      if (isVerbose) console.log("FileName:", fileName);

      const filePath = path.resolve(`./backup/${fileName}.cho`);
      if (isVerbose) console.log("FilePath:", filePath);

      try {
        // create directories if not already exist
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // write header
        const header =
          `{title: ${data.title}}\n` + `{artist: ${data.artist.name}}\n`;
        fs.writeFileSync(filePath, header, { flag: "w" });

        // append the rest of the content
        fs.writeFileSync(filePath, data.content, { flag: "a" });
      } catch (err) {
        console.error(errorStyle(err));
      }
    });

    return `Successfully backed up songs with user '${usr.displayName}'`;
  } else {
    throw new Error(`No songs to backup found with user '${usr.displayName}'`);
  }
};
