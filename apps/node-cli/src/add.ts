import fs from "fs";
import path from "path";

import chalk from "chalk";
import ChordSheetJS, {
  ChordLyricsPair,
  Comment,
  Song,
  Tag,
} from "chordsheetjs";
import { Arguments, Argv } from "yargs";

import publisherUser from "./publisherUser.json";
import { addSong } from "./songMethods";
import { IUser } from "./types";

const errorStyle = chalk.bold.red;
const warningStyle = chalk.hex("#FFA500").bold; // orange
const successStyle = chalk.bold.green;

interface Args {
  directory: string | undefined;
  all: boolean | undefined;
  name: string | undefined;
  publish: boolean | undefined;
  verbose: boolean | undefined;
}

// set user from imported json
const user = publisherUser as IUser;

const EXTERNAL_SOURCE = "Public Domain Christmas Songs";
const DEFAULT_ARTIST = "Public Domain";

export const command = "add [options]";
export const describe = "Add songs to the firestore database";

export const builder = (yargs: Argv): Argv<Args> => {
  return yargs
    .option("directory", {
      alias: "d",
      describe: "Path to directory with chord [.cho] files",
      type: "string",
    })
    .option("all", {
      alias: "a",
      describe: "Add all song files found",
      type: "boolean",
    })
    .option("name", {
      alias: "n",
      describe: "Only include filenames that match name query",
      type: "string",
    })
    .option("publish", {
      alias: "p",
      describe: "Publish the song",
      type: "boolean",
    })
    .option("verbose", {
      alias: "v",
      description: "Run with verbose logging",
      type: "boolean",
    })
    .example(
      '$0 add -d "<path to directory>" -a -p',
      "Adds all chord files found in the directory to firestore and publish them"
    )
    .example(
      '$0 add -d "<path to directory>" -n "realm"',
      'Adds only the chord files matching the word "realm" to firestore'
    )
    .example("$0 add --help", "Show help")
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
  let doAdd = false;
  let nameQuery = undefined;
  let sourcePath = undefined;
  let isPublished = false;

  if (argv.verbose) {
    console.info(warningStyle("Verbose mode on."));
    isVerbose = true;
  }

  if (argv.all) {
    console.info(
      successStyle(
        "--all argument found. Trying to upload all chord files found..."
      )
    );
    doAdd = true;
  } else if (argv.name) {
    nameQuery = argv.name;
    console.info(
      successStyle(
        `--name argument found. Trying to upload all chord files matching the name ${nameQuery} ...`
      )
    );
    doAdd = true;
  } else {
    console.info(
      warningStyle(
        "Neither --name or --all arguments found. Use --help for more information."
      )
    );
    doAdd = false;
  }

  if (argv.publish) {
    console.info(warningStyle("Publish mode on."));
    isPublished = true;
  }

  if (doAdd) {
    if (argv.directory) {
      sourcePath = argv.directory;
      console.info(successStyle(`Using path: '${sourcePath}`));
    } else {
      sourcePath = ".";
      console.info(
        successStyle(`No path argument found. Using current directory ...`)
      );
    }

    addSongs(user, sourcePath, nameQuery, isVerbose, isPublished).then(
      (results: PromiseSettledResult<string | undefined>[] | undefined) => {
        results?.forEach(result => {
          if (result.status === "fulfilled") {
            console.log(successStyle(`Success: "${result.value}"`));
          } else {
            console.log(errorStyle(`Failure: "${result.reason.message}"`));
          }
        });
      }
    );
  }
};

const hasChords = (song: Song, isVerbose: boolean): boolean => {
  for (const line of song.lines) {
    for (const item of line.items) {
      if (item instanceof ChordLyricsPair) {
        if (item.chords) {
          if (isVerbose) console.log("hasChords -> item.chords", item.chords);

          return true;
        }
      } else if (item instanceof Comment && item.content) {
        if (isVerbose) console.log("hasChords -> comment:", item.content);
      } else if (item instanceof Tag && item.name) {
        if (isVerbose)
          console.log(
            `hasChords -> tag name: ${item.name}, value: ${item.value}`
          );
      } else {
        if (isVerbose)
          console.log(
            "hasChords -> neither chord, tag or comment:",
            item.toString()
          );
      }
    }
  }

  return false;
};

const replaceWrongStrings = (rawText: string) => {
  let cleanedText = rawText;

  // fix old url http://www.ccli.com/Licenseholder/Search/SongSearch.aspx?s=27738
  const regexCCLI =
    /http:\/\/www.ccli.com\/Licenseholder\/Search\/SongSearch.aspx\?s=(\d+)/g;
  cleanedText = cleanedText.replace(
    regexCCLI,
    "https://songselect.ccli.com/Songs/$1"
  );

  // remove non functioning songclearance url www.songclearance.com
  const regexSongClearance = /#\s+https:\/\/www.songclearance.com[^\s]+\n/g;
  cleanedText = cleanedText.replace(regexSongClearance, "");

  // fix non functioning pdinfo url
  // cleanedText = cleanedText.replace(
  //   'http://www.pdinfo.com/PD-Music-Genres/PD-Christmas-Songs.php',
  //   'https://www.pdinfo.com/pd-music-genres/pd-christmas-songs.php'
  // );

  const regexPdInfo =
    /#\s+http:\/\/www.pdinfo.com\/PD-Music-Genres\/PD-Christmas-Songs.php\n/g;
  cleanedText = cleanedText.replace(
    regexPdInfo,
    '{verified: Public Domain - click "Source" for license information}\n'
  );

  return cleanedText;
};

// const hasPDInfoChristmasSongs = (rawText: string) => {
//   return rawText
//     .toLowerCase()
//     .includes('https://www.pdinfo.com/pd-music-genres/pd-christmas-songs.php');
// };

const isVerifiedPublicDomain = (rawText: string) => {
  return rawText.includes("verified: Public Domain");
};

const addSongs = async (
  usr: IUser,
  sourcePath: string,
  nameQuery: string | undefined,
  isVerbose: boolean,
  isPublished?: boolean
) => {
  const assetsPath = path.resolve(sourcePath);
  const assetsPathExists = fs.existsSync(assetsPath);

  if (assetsPathExists) {
    console.info(
      successStyle(
        `Asset folder exists (${assetsPath.toString()}). Adding songs ...`
      )
    );

    const paths = fs.readdirSync(assetsPath);

    // filter only .cho files
    const chordFiles = paths.filter(
      t => path.extname(t).toLowerCase() === ".cho"
    );

    // filter based on name
    const filteredFiles = nameQuery
      ? chordFiles.filter(t =>
          t.toLowerCase().includes(nameQuery.toLowerCase())
        )
      : chordFiles;

    // test using  one file
    // const filteredFiles = chordFiles.filter(
    //   t => t === 'Angels From The Realms Of Glory.cho'
    // );

    const filesContent = filteredFiles.map(fileName => {
      if (isVerbose) console.log("FileName:", fileName);
      const filePath = path.resolve(`${sourcePath}/${fileName}`);
      if (isVerbose) console.log("FilePath:", filePath);
      if (fs.existsSync(filePath)) {
        return {
          filePath,
          fileName,
        };
      }
    });

    const filePromises: Promise<string | undefined>[] = [];

    filesContent.forEach(async elem => {
      const filePath = elem?.filePath as string;
      const fileName = elem?.fileName as string;

      filePromises.push(
        handleEachSongFile(usr, filePath, fileName, isVerbose, isPublished)
      );
    });

    return await Promise.allSettled(filePromises);
  }
};

const handleEachSongFile = async (
  usr: IUser,
  filePath: string,
  fileName: string,
  isVerbose: boolean,

  published?: boolean
) => {
  try {
    const name = path.parse(fileName).name;
    if (isVerbose) {
      console.log(successStyle("Processing song file:", name));
    }

    // https://raw.githubusercontent.com/pathawks/Christmas-Songs/master/Hark%20the%20Herald%20Angels%20Sing.cho
    // const url = `https://raw.githubusercontent.com/pathawks/Christmas-Songs/master/${encodeURIComponent(
    //   fileName
    // )}`;
    const url =
      "https://www.pdinfo.com/mobile/pd-music-genres/pd-christmas-songs.php";

    const rawData = fs.readFileSync(filePath);
    const chordProOrig = rawData.toString();

    // replace strings that we know are wrong
    const chordPro = replaceWrongStrings(chordProOrig);

    // check if it has a pdinfo.com Public Domain url
    // if (!hasPDInfoChristmasSongs(chordPro)) {
    if (!isVerifiedPublicDomain(chordPro)) {
      throw new Error(
        "The song does not include any Public Domain Info (pdinfo.com). Skipping ..."
      );
    }

    // get artist and title from the chord pro song
    const s = new ChordSheetJS.ChordProParser().parse(chordPro);

    if (hasChords(s, isVerbose)) {
      if (isVerbose) {
        console.log(
          successStyle("The song has chords. Ready to save to database ...")
        );
      }

      const title = Array.isArray(s.title) ? s.title[0] : (s.title ?? "");
      const artist = Array.isArray(s.artist)
        ? s.artist[0]
        : (s.artist ?? DEFAULT_ARTIST);

      const newSong = await addSong(
        usr,
        title,
        artist,
        chordPro,

        isVerbose,

        "cli",
        url,
        EXTERNAL_SOURCE,

        published
      );

      return `Successfully handled song '${fileName}' (${newSong?.id})`;
    } else {
      throw new Error("The song does not include any chords. Skipping ...");
    }
  } catch (error) {
    throw new Error(`Failed handling song '${fileName}'. ` + error);
  }
};
