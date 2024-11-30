import { FunctionComponent } from "react";
import { Text, View } from "react-native";

import { CustomHtmlDivFormatter } from "@chordmaster/utils";
import {
  Chord,
  ChordLyricsPair,
  ChordProParser,
  ChordSheetParser,
  Comment,
  Literal,
  Song,
  Tag,
  Ternary,
} from "chordsheetjs";

// have to copy this from the chordsheetjs main.d.ts since it's not exported
type Item = ChordLyricsPair | Comment | Tag | Ternary | Literal;

interface SongProps {
  chords: Chord[];
  htmlSong: string;
}

interface Props {
  chordProSong?: string;
  chordSheetSong?: string;
  transposeDelta?: number;
  showTabs?: boolean;
  fontSize?: number;
  children(props: SongProps): JSX.Element;
}

const showErrorMessage = (area: string, e: unknown): JSX.Element | null => {
  if (e instanceof Error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          style={{
            paddingHorizontal: 30,
            paddingBottom: 20,
            fontSize: 18,
            textAlign: "center",
          }}>
          Failed in {area}:
        </Text>
        <Text
          style={{
            paddingHorizontal: 30,
            paddingBottom: 20,
            fontSize: 18,
            textAlign: "center",
          }}>
          {e.message}
        </Text>
      </View>
    );
  }

  return null; // Return null if `e` is not an instance of `Error`
};

const processChord = (item: Item, processor: (parsedChord: Chord) => Chord) => {
  if (item instanceof ChordLyricsPair) {
    if (item.chords) {
      const parsedChord = Chord.parse(item.chords) as Chord;

      if (parsedChord) {
        // TODO: fix bug in the opensheetjs 7.6.0 release related to bass notes
        // fixChordMinorBassIssue(parsedChord);

        const processedChord = processor(parsedChord);

        // return a ChordLyricsPair where the chords have been processed
        const processedChordLyricsPair = item.clone();
        processedChordLyricsPair.chords = processedChord.toString();
        return processedChordLyricsPair;
      }
    }
  } else if (item instanceof Comment && item.content) {
    // console.log('processChord -> comment:', item.content);
    // check if the comment also contains chords
    // let commentSong = new ChordProParser().parse(item.content);
    // commentSong = transformSong(commentSong, processor);
    // item.content = new ChordProFormatter().format(commentSong);
  } else if (item instanceof Tag && item.name) {
    // console.log(`processChord -> tag name: ${item.name}, value: ${item.value}`);
  } else {
    console.log(
      "processChord -> neither chord, tag or comment:",
      item.toString()
    );
  }

  return item;
};

const transformSong = (
  song: Song,
  processor: (parsedChord: Chord) => Chord
) => {
  song.lines = song.lines.map(line => {
    line.items = line.items.map(item => processChord(item, processor));
    return line;
  });
  return song;
};

export const transposeSong = (song: Song, transposeDelta: number) =>
  transformSong(song, chord => chord.transpose(transposeDelta));

export const getChords = (song: Song): Chord[] => {
  // console.log('song.lines.length', song.lines.length);
  const allChords: Chord[] = [];

  song.lines.forEach(line => {
    line.items.forEach(item => {
      // ChordLyricsPair?
      if (item instanceof ChordLyricsPair) {
        if (item.chords) {
          // console.log('Chord -> item.chords', item.chords);
          const parsedChord = Chord.parse(item.chords);

          if (parsedChord) {
            // console.log('Chord -> parsedChord', parsedChord);
            // only add chord if not already exists
            if (!allChords.some(c => c.toString() === parsedChord.toString())) {
              allChords.push(parsedChord);
            }
          } else {
            // warning, we cannot parse this chord
            console.log("Warning could not parse chord:", item.chords);
          }
        }
      } else if (item instanceof Comment && item.content) {
        // console.log('getChords -> comment:', item.content);

        // remove html stuff like %20
        let commentCleaned = item.content;
        commentCleaned = commentCleaned.replace(/%\d{2}/g, "");
        // console.log('getChords -> comment cleaned:', commentCleaned);

        const commentSong = new ChordProParser().parse(commentCleaned);
        getChords(commentSong).forEach(c => {
          if (!allChords.some(ac => ac.toString() === c.toString())) {
            allChords.push(c);
          }
        });
      } else if (item instanceof Tag && item.name) {
        // console.log(
        //   `getChords -> tag name: ${item.name}, value: ${item.value}`
        // );
      } else {
        console.log(
          "getChords -> neither chord, tag or comment:",
          item.toString()
        );
      }
    });
  });
  // console.log('allChords.length', allChords.length);
  return allChords;
};

const SongTransformer: FunctionComponent<Props> = props => {
  const showTabs = true;
  const transposeDelta = 0;
  const fontSize = 14;

  let { chordProSong } = props;

  let htmlSong = "";
  let allChords: Chord[];
  let song: Song;

  try {
    if (chordProSong) {
      if (!showTabs) {
        chordProSong = chordProSong.replace(
          /{(sot|start_of_tab)[^{]*}(.|\n|\r)*?{(eot|end_of_tab)[^{]*}\r?\n?/g,
          ""
        );
      }
      song = new ChordProParser().parse(chordProSong);
    } else {
      song = new ChordSheetParser({
        preserveWhitespace: true,
      }).parse(props.chordSheetSong!);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return showErrorMessage("Parser", e);
    } else {
      throw e;
    }
  }

  let transposedSong = song;

  try {
    if (transposeDelta !== 0) {
      transposedSong = transposeSong(song, transposeDelta);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return showErrorMessage("Transpose", e);
    } else {
      throw e;
    }
  }

  try {
    allChords = getChords(transposedSong);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return showErrorMessage("getChords", e);
    } else {
      throw e;
    }
  }

  try {
    htmlSong = new CustomHtmlDivFormatter().format(transposedSong, fontSize);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return showErrorMessage("HtmlFormatter", e);
    } else {
      throw e;
    }
  }

  return props.children({ chords: allChords, htmlSong });
};

export default SongTransformer;
