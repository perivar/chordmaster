import { FunctionComponent, useRef } from "react";
import {
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import {
  getChordAsString,
  getChordInformation,
  getNotesChordAlternatives,
  NotesChordAlternatives,
} from "@chordmaster/utils";
import { Chord } from "chordsheetjs";

import { useTheme } from "../hooks/useTheme";
import ChordChart from "../components/ChordChart";

import { FONTS } from "../constants/theme";
// originally from: https://github.com/artutra/OpenChord/tree/master/app/assets/chords
// better? : https://github.com/T-vK/chord-collection
// import chords from '../assets/chords/guitar.json';
import chords from "../assets/chords/chords.json";

interface ChordsData {
  [index: string]: {
    positions: string[]; // ['5', '7']
    fingerings: string[][]; // [ ['0', '0'], ['1', '1'] ]
  }[];
}

interface Props {
  showPiano: boolean;
  selectedChord: Chord | null | undefined;
  allChords: Chord[];
  onPressClose: () => void;
  closeLabel: string;
}

const ChordTab: FunctionComponent<Props> = ({
  showPiano,
  selectedChord,
  allChords,
  onPressClose,
  closeLabel,
}) => {
  const flatlistRef = useRef<FlatList<Chord>>(null);

  const { theme } = useTheme();
  const { colors } = theme;

  if (selectedChord === null) return null;

  const scrollToIndex = (index: number) => {
    if (index >= 0) {
      flatlistRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  // find initial index of the selected chord in the chord list
  const initialIndex = allChords.findIndex(
    chord => chord.toString() === selectedChord?.toString()
  );

  // scroll to initial index
  const wait = new Promise(resolve => setTimeout(resolve, 100));
  wait.then(() => {
    scrollToIndex(initialIndex);
  });

  const renderPianoChord = (
    item: Chord,
    selectedStyle: StyleProp<ViewStyle>,
    notesChordAlternatives: NotesChordAlternatives | undefined
  ) => {
    return (
      <View
        key={item.toString()}
        style={[
          styles.pianoItem,
          selectedStyle,
          { borderColor: colors.secondary },
        ]}>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            marginTop: 5,
          }}>
          <View style={styles.noteGridRow}>
            {notesChordAlternatives?.chordNotes.map(note => (
              <View style={styles.noteGridColumn} key={note}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.primary,
                    ...FONTS.h5,
                  }}>
                  {note}
                </Text>
              </View>
            ))}
            {notesChordAlternatives?.bassNote && (
              <View
                style={styles.noteGridColumnBass}
                key={notesChordAlternatives.bassNote}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.tertiary,
                    ...FONTS.body5,
                  }}>
                  {"/" + notesChordAlternatives.bassNote}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.noteGridRow}>
            {notesChordAlternatives?.chordIntervals.map(interval => (
              <View style={styles.noteGridColumn} key={interval}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.secondary,
                    ...FONTS.body5,
                  }}>
                  {interval}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView
          style={{
            marginTop: 2,
            flexDirection: "column",
            width: "100%",
          }}>
          <View
            style={{
              alignItems: "center",
            }}>
            {notesChordAlternatives?.chordNames.map(chord => (
              <Text
                style={{
                  ...FONTS.body5,
                  lineHeight: 20,
                  color: colors.tertiary,
                }}
                key={chord}>
                {chord}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderGuitarChord = (
    item: Chord,
    selectedStyle: StyleProp<ViewStyle>,
    position: string[]
  ) => {
    return (
      <View
        key={item.toString()}
        style={[styles.item, selectedStyle, { borderColor: colors.secondary }]}>
        <ChordChart width={100} height={120} chord={position} />
        <Text style={{ ...FONTS.body5, color: colors.tertiary }}>
          {item.toString()}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: colors.background,
        },
      ]}>
      <TouchableOpacity
        style={[styles.closeButton, { borderColor: colors.outline }]}
        onPress={onPressClose}>
        <Text style={[styles.closeButtonText, { color: colors.onBackground }]}>
          {closeLabel}
        </Text>
      </TouchableOpacity>
      <FlatList
        ref={flatlistRef}
        style={[styles.chordList, { backgroundColor: colors.background }]}
        initialNumToRender={allChords.length}
        onScrollToIndexFailed={() => {}}
        keyExtractor={(item, _index) => item.toString()}
        horizontal
        data={allChords}
        extraData={selectedChord}
        renderItem={({ item }) => {
          const chordName = getChordAsString(item);
          const selectedChordName =
            selectedChord && getChordAsString(selectedChord);

          const tabDatabase = chords as ChordsData;
          let position: string[] = [];
          if (tabDatabase.hasOwnProperty(chordName)) {
            const chordObj = tabDatabase[chordName].find(() => true);
            if (chordObj) {
              position = chordObj.positions;
            }
          }

          let selectedStyle: StyleProp<ViewStyle> = null;
          if (chordName === selectedChordName) {
            selectedStyle = styles.itemSelected;
          }

          // Get piano alternatives only if showPiano is true
          const notesChordAlternatives = showPiano
            ? getNotesChordAlternatives(
                chordName,
                // 'C°7(addM7,11,b13)',
                getChordInformation,
                true
              )
            : undefined;

          return (
            <>
              {showPiano
                ? renderPianoChord(item, selectedStyle, notesChordAlternatives)
                : renderGuitarChord(item, selectedStyle, position)}
            </>
          );
        }}
      />
    </View>
  );
};

export default ChordTab;

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: 200,
    zIndex: 999,
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
  chordList: {},
  item: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pianoItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 5,
    paddingHorizontal: 5,
    margin: 5,
  },
  itemSelected: {
    borderWidth: 1,
  },

  noteGridRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  noteGridColumn: {
    flexDirection: "column",
    // borderColor: 'green',
    // borderWidth: 0.5,
    alignItems: "center",
    width: 30,
  },
  noteGridColumnBass: {
    flexDirection: "column",
    // borderColor: 'blue',
    // borderWidth: 0.5,
    alignItems: "center",
    paddingLeft: 3,
    paddingRight: 3,
  },
});
