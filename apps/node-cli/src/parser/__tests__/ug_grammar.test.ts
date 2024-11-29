import {
  chordTestChordPro4,
  chordTestPlainFormatter4,
} from "@chordmaster/utils";
import ChordSheetJS, { ChordSheetSerializer } from "chordsheetjs";

import { parse as parseChordPro, ParseOptions } from "../chord_pro_peg_parser";

export type ChordProParserOptions = ParseOptions & {
  softLineBreaks?: boolean;
};

const normalizeLineEndings = (string: string): string => {
  return string.replace(/\r\n?/g, "\n");
};

// const parseUltimateGuitarRaw = (content: string) => {
//   const ast = parseUGRaw(normalizeLineEndings(content));
//   //   console.log(JSON.stringify(ast, null, 2));

//   const song = new ChordSheetSerializer().deserialize(ast);
//   //   console.log(JSON.stringify(song, null, 2));

//   // original text formatter
//   const plainText = new ChordSheetJS.TextFormatter().format(song);

//   // Note! we cannot use a formatter imported from a different root folder, due to wrong instanceof name
//   // console.log(`constructor: ${song.constructor.name}`);
//   // use custom ultimate guitar formatter instead of the plaintext formatter
//   //   const plainText = new CustomUltimateGuitarFormatter().format(song);
//   //   console.log(plainText);

//   return plainText;
// };

const parseUltimateGuitarChordPro = (content: string) => {
  const ast = parseChordPro(normalizeLineEndings(content)) as never;
  //   console.log(JSON.stringify(ast, null, 2));

  const song = new ChordSheetSerializer().deserialize(ast);
  //   console.log(JSON.stringify(song, null, 2));

  // original text formatter
  const plainText = new ChordSheetJS.TextFormatter().format(song);

  // Note! we cannot use a formatter imported from a different root folder, due to wrong instanceof name
  // console.log(`constructor: ${song.constructor.name}`);
  // use custom ultimate guitar formatter instead of the plaintext formatter
  //   const plainText = new CustomUltimateGuitarFormatter().format(song);
  //   console.log(plainText);

  return plainText;
};

// test('ParseUltimateGuitarRaw', () => {
//   expect(parseUltimateGuitarRaw(chordTestUGRaw2)).toBe(chordTestUGPlain);
// });

test("ParseUltimateGuitarChordPro", () => {
  expect(parseUltimateGuitarChordPro(chordTestChordPro4)).toBe(
    chordTestPlainFormatter4
  );
});
