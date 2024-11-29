import fs from "fs";

import {
  CustomUltimateGuitarFormatter,
  CustomUltimateGuitarRawParser,
  parseUltimateGuitar,
} from "@chordmaster/utils";
import axios from "axios";
import chalk from "chalk";
import ChordSheetJS from "chordsheetjs";
import { Arguments, Argv } from "yargs";

import personalUser from "./personalUser.json";
import { addSong, listSongs, removeSongs } from "./songMethods";
import { IUser } from "./types";

const errorStyle = chalk.bold.red;
const warningStyle = chalk.hex("#FFA500").bold; // orange
const successStyle = chalk.bold.green;

interface Args {
  url: string | undefined;
  json: string | undefined;
  delete: boolean | undefined;
  list: boolean | undefined;
  verbose: boolean | undefined;
}

// set user from imported json
const user = personalUser as IUser;

const EXTERNAL_SOURCE = "UltimateGuitar CLI";

export const command = "ug [options]";
export const describe = "Scrape UltimateGuitar chord songs";

export const builder = (yargs: Argv): Argv<Args> => {
  return yargs
    .option("url", {
      alias: "u",
      describe: "Scrape the given url",
      type: "string",
    })
    .option("json", {
      alias: "j",
      describe: "Scrape all the urls found in the json file",
      type: "string",
    })
    .option("delete", {
      alias: "d",
      describe:
        "Delete all UltimateGuitar chord files previously added using cli from firestore",
      type: "boolean",
    })
    .option("list", {
      alias: "l",
      describe:
        "List all UltimateGuitar chord files previously added using cli from firestore",
      type: "boolean",
    })
    .option("verbose", {
      alias: "v",
      description: "Run with verbose logging",
      type: "boolean",
    })

    .example('$0 ug -u "<url to song>"', "Scrape the given url")
    .example(
      '$0 ug -j "<path to json file>"',
      "Scrape the urls found within the json file"
    )
    .example(
      "$0 ug -d",
      "Delete all UltimateGuitar chord files previously added using cli from firestore"
    )
    .example(
      "$0 ug -l",
      "List all UltimateGuitar chord files previously added using cli from firestore"
    )
    .example("$0 ug --help", "Show help")
    .check((argv: Arguments<Args>) => {
      if (!argv.url && !argv.json && !argv.delete && !argv.list) {
        throw new Error("You must supply --url or --json");
      } else {
        return true;
      }
    });
};

export const handler = async (argv: Arguments<Args>): Promise<void> => {
  // process arguments using yarg
  let doQuery = false;
  let isVerbose = false;
  let url: string | undefined = undefined;
  let jsonPath: string | undefined = undefined;
  let doRemove = false;
  let doList = false;

  if (argv.verbose) {
    console.info(warningStyle("Verbose mode on."));
    isVerbose = true;
  }

  if (argv.url) {
    url = argv.url;
    console.info(
      successStyle(`--url argument found. Trying to scrape url: ${url} ...`)
    );
    doQuery = true;
  } else if (argv.json) {
    jsonPath = argv.json;
    console.info(
      successStyle(
        `--json argument found. Trying to open json file: ${jsonPath} ...`
      )
    );
    doQuery = true;
  } else if (argv.delete) {
    console.info(
      successStyle(
        "--delete argument found. Trying to delete all UltimateGuitar chord files previously added by this cli ..."
      )
    );
    doRemove = true;
  } else if (argv.list) {
    console.info(
      successStyle(
        "--list argument found. Trying to list all UltimateGuitar chord files previously added by this cli ..."
      )
    );
    doList = true;
  } else {
    console.info(
      warningStyle(
        "Neither -u or --url arguments found. Use --help for more information."
      )
    );
    doQuery = false;
  }

  if (doRemove) {
    removeSongs(EXTERNAL_SOURCE, undefined, isVerbose)
      .then(res => console.log(successStyle(res)))
      .catch(err => console.log(errorStyle(err)));
  } else if (doList) {
    listSongs(EXTERNAL_SOURCE, undefined, isVerbose)
      .then(res => console.log(successStyle(res)))
      .catch(err => console.log(errorStyle(err)));
  } else if (doQuery) {
    if (url) {
      await handleEachSongUrl(url, isVerbose);
    }
    if (jsonPath) {
      const dataArray: { songs: string[] } = JSON.parse(
        fs.readFileSync(jsonPath, "utf-8")
      );
      const songUrls = dataArray.songs;

      const handleSongPromises: Promise<string | undefined>[] = [];

      songUrls.forEach(async songUrl => {
        handleSongPromises.push(handleEachSongUrl(songUrl, isVerbose));
      });

      // Debug Special cases:
      // 0  - Mykonos (intro section on top of guitar tab)
      // 2  - Man in the mirror (chords on top of guitar tab)
      // 4  - Thinking of You - Katy Perry (missing spaces between lyrics)
      // 6  - Annies song (last line was not parsed and chords with bass)
      // 11 - Like A Star by Corinne Bailey Rae (lots of chords like C7b9, F7M, E7b9, D9/F#, E7#5)
      // 12 - At last - Etta James (chords like A7+5, AM7 and DM7) - chord replacement shifts the lyrics wrong!
      // 15 - Unfaithful - Rihanna (slashes between chords)
      // 16 - I Cant Make You Love Me - Bonnie Raitt (Fmaj9 chord not working)
      // 20 - Like A Star - Corinne Bailey Rae (chords on top and bottom of guitar tab and chords like F7M and Eaug)
      // 25 - Can't help falling in Love - Elvis (URL with %27)
      // 29 - Everybody knows - John Legend (missing intro chords due to commas between them)
      // 31 - Haus Am See (two tabs side by side, many chords are missing ch tags)
      // 33 - Tennessee Whiskey (different types of tabs and chords with bass)
      // 44 - Der Ziemlich Okaye Popsong Chords by Farin Urlaub Racing Team (H chords)
      // 46 - Hallelujah - Brian Doerksen (header with colon in the middle of a sentence)
      // 48 - Drunk Again - Reel Big Fish (missing intro chords due to x2)
      // 52 - Slippin (header with parenthesis)
      // handleSongPromises.push(handleEachSongUrl(songUrls[0], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[2], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[4], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[6], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[11], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[12], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[15], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[16], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[20], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[25], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[29], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[31], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[33], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[44], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[46], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[48], isVerbose));
      // handleSongPromises.push(handleEachSongUrl(songUrls[52], isVerbose));

      await Promise.allSettled(handleSongPromises).then(
        (results: PromiseSettledResult<string | undefined>[] | undefined) =>
          results?.forEach(result => {
            if (result.status === "fulfilled") {
              console.log(successStyle(`Success: "${result.value}"`));
            } else {
              console.log(errorStyle(`Failure: "${result.reason.message}"`));
            }
          })
      );
    }
  }
};

const handleEachSongUrl = async (url: string, isVerbose: boolean) => {
  try {
    console.log(successStyle("Processing url:", url));

    if (url.startsWith("https://tabs.ultimate-guitar.com/")) {
      const fetchResult = await axios.get(url);
      const htmlResult = await fetchResult.data;

      const { artist, songName, content } = parseUltimateGuitar(htmlResult);

      if (content) {
        if (isVerbose) {
          console.info(warningStyle(`--------------------------------`));
          console.info(warningStyle(`Artist: ${artist}`));
          console.info(warningStyle(`Song Name: ${songName}`));
          console.info(warningStyle(`--------------------------------`));

          console.info(warningStyle(content));
        }

        const chordSheetSong = new CustomUltimateGuitarRawParser({
          preserveWhitespace: false,
        }).parse(content);

        const chordPro = new ChordSheetJS.ChordProFormatter().format(
          chordSheetSong
        );

        if (isVerbose) {
          console.info(errorStyle(chordPro));
        }

        if (isVerbose) {
          // use custom ultimate guitar formatter instead of the plaintext formatter
          const plainText = new CustomUltimateGuitarFormatter().format(
            chordSheetSong
          );
          console.info(successStyle(plainText));
        }

        // return `Dummy added song '${songName}' by '${artist}' ...`;

        const songTitle = songName ?? "";
        const songArtist = artist ?? "";
        const published = false;

        const newSong = await addSong(
          user,
          songTitle,
          songArtist,
          chordPro,

          isVerbose,

          "cli",
          url,
          EXTERNAL_SOURCE,

          published
        );

        return `Successfully added song '${songTitle}' by '${songArtist}' (${newSong?.id})`;
      }
    }
  } catch (error) {
    throw new Error(`Failed handling song '${url}'. ` + error);
  }
};
