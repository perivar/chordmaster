import { FunctionComponent, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  TextInput as NativeTextInput,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  CustomUltimateGuitarFormatter,
  CustomUltimateGuitarParser,
  getChordAlternativesTonal,
  getChordSymbol,
} from "@chordmaster/utils";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ChordSheetJS from "chordsheetjs";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, TextInput } from "react-native-paper";

import useFirestore, { IArtist } from "../hooks/useFirestore";
import useFirestoreReduxMethods from "../hooks/useFirestoreReduxMethods";
import { useLocalization } from "../hooks/useLocalization";
import { useTheme } from "../hooks/useTheme";
import PageView from "../components/PageView";
import TextInputModal from "../components/TextInputModal";
import TouchableIcon from "../components/TouchableIcon";
import { verifyUserClick } from "../utils/verifyUserClick";

import { RootStackParamList } from "../types/types";
import { userSelector } from "../redux/slices/auth";
import {
  addOrUpdateArtistReducer,
  addOrUpdateSongReducer,
} from "../redux/slices/library";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";

type SongEditScreenRouteProp = RouteProp<RootStackParamList, "SongEdit">;
type SongEditScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SongEdit"
>;
type Props = {
  route: SongEditScreenRouteProp;
  navigation: SongEditScreenNavigationProp;
};

const SongEdit: FunctionComponent<Props> = props => {
  const { navigation, route } = props;
  let songIdParam = route.params?.id;

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const allSongs = useAppSelector(state => state.library.songs);
  const song = allSongs.find(s => s.id === songIdParam);

  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [sourceLabel, setSourceLabel] = useState<string>("");
  const [sourceUrl, setSourceUrl] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"CHORD_PRO" | "CHORD_SHEET">("CHORD_PRO");

  const [isReplaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replaceFromText, setReplaceFromText] = useState<string>("");
  const [replaceWithText, setReplaceWithText] = useState<string>("");

  const [isAddChordNotesModalOpen, setAddChordNotesModalOpen] = useState(false);
  const [addChordNotesText, setAddChordNotesText] = useState<string>("");

  const [isAddChordModalOpen, setAddChordModalOpen] = useState(false);
  const [addChordText, setAddChordText] = useState<string>("");

  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [selectedText, setSelectedText] = useState<string>();

  const [isChordsFieldFocused, setIsChordsFieldFocused] = useState(false);

  const { addNewSong, editSong, getArtistsByName, addNewArtist } =
    useFirestore();
  const { isLoading, loadSongData } = useFirestoreReduxMethods();

  useEffect(() => {
    if (songIdParam) {
      navigation.setOptions({ title: t("edit_song") });
    } else {
      navigation.setOptions({ title: t("create_song") });
    }
  }, []);

  useEffect(() => {
    if (!songIdParam) return;

    // always force reload when editing a song?
    // if (!song) {
    loadSongData(songIdParam);
    // }
  }, [songIdParam]);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist.name);
      setContent(removeMetaTags(song.content));

      setSourceLabel(song.external.source ?? "");
      setSourceUrl(song.external.url ?? "");
    }
  }, [song]);

  useEffect(() => {
    // console.log(`Selection ${selection.start} to ${selection.end}`);

    if (selection && selection.start !== selection.end) {
      const selText = content.substring(selection.start, selection.end);
      // console.log(
      //   `Selected text from ${selection.start} to ${selection.end} is ${selText}`
      // );

      setSelectedText(selText);
    } else {
      setSelectedText(undefined);
    }
  }, [selection]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flex: 1, flexDirection: "row" }}>
          {!selectedText && isChordsFieldFocused && (
            <>
              <TouchableIcon
                onPress={() => {
                  setAddChordModalOpen(true);
                }}
                name="music-box"
                color={colors.onBackground}
              />

              <TouchableIcon
                onPress={() => {
                  setAddChordNotesModalOpen(true);
                }}
                name="music-box-multiple"
                color={colors.onBackground}
              />
            </>
          )}
          {selectedText && (
            <>
              <TouchableIcon
                onPress={() => {
                  setReplaceFromText(selectedText);
                  setReplaceModalOpen(true);
                }}
                name="find-replace"
                color={colors.onBackground}
              />

              {/* <TouchableIcon
                onPress={() =>
                  verifyUserClick(
                    'Convert to chord?',
                    'Are you sure you want to convert selected text to a chord?',
                    () => {
                      doConvertToChord();
                    }
                  )
                }
                name="music-circle"
                color={colors.onBackground}
              /> */}
              <TouchableIcon
                onPress={() =>
                  verifyUserClick(
                    "Enclose in brackets?",
                    "Are you sure you want to enclose the selected text in brackets?",
                    () => {
                      doEncloseInBrackets();
                    }
                  )
                }
                name="code-brackets"
                color={colors.onBackground}
              />
            </>
          )}
          <TouchableIcon
            onPress={saveSong}
            name="content-save"
            color={colors.onBackground}
          />
        </View>
      ),
    });
  }, [
    navigation,
    title,
    content,
    artist,
    selectedText,
    sourceLabel,
    sourceUrl,
    colors.onBackground,
    isChordsFieldFocused,
  ]);

  const doReplaceText = () => {
    if (replaceFromText) {
      verifyUserClick(
        "Find and replace text?",
        `Are you sure you want to replace '${replaceFromText}' with '${replaceWithText}' everywhere?`,
        () => {
          // console.log(
          //   `Performing replace ${replaceFromText} with ${replaceWithText}`
          // );

          const newContent = content
            .split(replaceFromText)
            .join(replaceWithText);

          setContent(newContent);

          // unselect
          setSelection({ start: 0, end: 0 });
        },
        () => {
          setReplaceModalOpen(false);

          // unselect
          setSelection({ start: 0, end: 0 });
        },
        () => {
          setReplaceModalOpen(false);

          // unselect
          setSelection({ start: 0, end: 0 });
        }
      );
    }
  };

  const doAddChordNotes = () => {
    if (addChordNotesText) {
      setAddChordNotesModalOpen(false);

      if (selection && selection.start && selection.end) {
        // lookup alternative chord names
        const chordNotes = addChordNotesText.split(/[\s,.]/).filter(Boolean);
        // console.log('chordNotes', chordNotes);

        // lookup alternative chord names
        const alternatives = getChordAlternativesTonal(chordNotes);
        const chordNames = alternatives.chordNames;
        // console.log('chordNames', chordNames);

        if (chordNames && chordNames.length > 0) {
          let chordText = chordNames[0]; // choose the first

          // make sure the chord name is formatted well
          chordText = getChordSymbol(chordText);

          const chordPro = content;

          if (mode === "CHORD_PRO") {
            // enclose the chord in brackets
            chordText = "[" + chordText + "]";
          }

          const newContent =
            chordPro.substring(0, selection.start) +
            chordText +
            chordPro.substring(selection.end, chordPro.length);

          setContent(newContent);
        } else {
          Alert.alert(
            "Error",
            `Aborting since we did not find a chord matching ${chordNotes.join(
              " "
            )}`
          );
        }
      }
    }
  };

  const doAddChord = () => {
    if (addChordText) {
      setAddChordModalOpen(false);

      if (selection && selection.start && selection.end) {
        let chordText = addChordText;
        const chordPro = content;

        if (mode === "CHORD_PRO") {
          // enclose the chord in brackets
          chordText = "[" + chordText + "]";
        }

        const newContent =
          chordPro.substring(0, selection.start) +
          chordText +
          chordPro.substring(selection.end, chordPro.length);

        setContent(newContent);
      }
    }
  };

  // const doConvertToChord = () => {
  //   if (selectedText) {
  //     // check if chord
  //     const parsedChord = getChordInformation(selectedText);

  //     if (parsedChord.isChord) {
  //       // console.log('Chord -> parsedChord', parsedChord);

  //       let chordPro = content;

  //       // enclose the selected chord in brackets
  //       const newContent =
  //         chordPro.substring(0, selection.start) +
  //         '[' +
  //         parsedChord.chordName +
  //         ']' +
  //         chordPro.substring(selection.end, chordPro.length);

  //       setContent(newContent);

  //       // unselect
  //       setSelection({ start: 0, end: 0 });
  //     } else {
  //       Alert.alert('Error', `Aborting since ${selectedText} is not a chord`);
  //     }
  //   }
  // };

  const doEncloseInBrackets = () => {
    if (selectedText) {
      const chordPro = content;

      // enclose the selected chord in brackets
      const newContent =
        chordPro.substring(0, selection.start) +
        "[" +
        selectedText +
        "]" +
        chordPro.substring(selection.end, chordPro.length);

      setContent(newContent);

      // unselect
      setSelection({ start: 0, end: 0 });
    }
  };

  const removeMetaTags = (text: string) => {
    text = text.replace(/{title:[^}]+}\n?/g, "");
    text = text.replace(/{t:[^}]+}\n?/g, "");
    text = text.replace(/{artist:[^}]+}\n?/g, "");
    text = text.replace(/{a:[^}]+}\n?/g, "");
    return text;
  };

  const saveSong = async () => {
    if (title.trim() === "") return setError(t("invalid_title"));
    if (artist.trim() === "") return setError(t("invalid_artist"));
    if (content.trim() === "") return setError(t("invalid_content"));

    const artistName = artist.trim();
    const songTitle = title.trim();
    let chordPro = content;

    const srcLabel = sourceLabel.trim();
    const srcUrl = sourceUrl.trim();

    if (mode === "CHORD_SHEET") {
      // original parser:
      // let chordSheetSong = new ChordSheetJS.ChordSheetParser({
      //   preserveWhitespace: false,
      // }).parse(content);

      // using custom ultimate guitar parser instead of the ChordSheet parser
      const chordSheetSong = new CustomUltimateGuitarParser({
        preserveWhitespace: false,
      }).parse(content);

      // Tested out ChordsOverWordsParser, but disabled for now:
      // let chordSheetSong = new ChordsOverWordsParser().parse(content);

      chordPro = new ChordSheetJS.ChordProFormatter().format(chordSheetSong);
    }

    let artistDb: IArtist;
    const artists = await getArtistsByName(artistName);
    if (artists && artists.length > 0) {
      artistDb = artists[0];
    } else {
      artistDb = await addNewArtist(artistName);
      await dispatch(addOrUpdateArtistReducer(artistDb));
    }

    if (songIdParam) {
      try {
        const updatedSong = await editSong(
          songIdParam,
          {
            id: artistDb.id,
            name: artistDb.name,
          },
          songTitle,
          chordPro,

          song?.external?.id,
          srcUrl ?? "",
          srcLabel ?? ""
        );

        // console.log('SongEdit -> editSong:', updatedSong);
        songIdParam = updatedSong.id;

        await dispatch(addOrUpdateSongReducer(updatedSong));
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          throw e;
        }
      }
    } else {
      try {
        if (!user) throw new Error("User object is undefined!");

        const newSong = await addNewSong(
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          {
            id: artistDb.id,
            name: artistDb.name,
          },
          songTitle,
          chordPro,

          "",
          srcUrl ?? "",
          srcLabel ?? ""
        );

        // console.log('SongEdit -> addNewSong:', newSong);
        songIdParam = newSong.id;

        await dispatch(addOrUpdateSongReducer(newSong));
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          throw e;
        }
      }
    }

    navigation.replace("SongView", { id: songIdParam!, title: songTitle });
  };

  const switchToChordPro = () => {
    try {
      // original parser:
      // let s = new ChordSheetJS.ChordSheetParser({
      //   preserveWhitespace: false,
      // }).parse(content);

      // using custom ultimate guitar parser instead of the ChordSheet parser
      const s = new CustomUltimateGuitarParser({
        preserveWhitespace: false,
      }).parse(content);

      // Tested out ChordsOverWordsParser, but disabled for now:
      // let s = new ChordsOverWordsParser().parse(content);

      // console.log('switchToChordPro:', s);
      const chordPro = new ChordSheetJS.ChordProFormatter().format(s);

      // console.log(chordPro);
      setContent(chordPro);
      setMode("CHORD_PRO");
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("Error", e.message);
      } else {
        throw e;
      }
    }
  };

  const switchToChordSheet = () => {
    try {
      const s = new ChordSheetJS.ChordProParser().parse(content);
      // console.log('switchToChordSheet:', JSON.stringify(s, null, 2));

      // original text formatter
      // let plainText = new ChordSheetJS.TextFormatter().format(s);

      // use custom ultimate guitar formatter instead of the plaintext formatter
      const plainText = new CustomUltimateGuitarFormatter().format(s);

      // console.log(plainText);
      setContent(plainText);
      setMode("CHORD_SHEET");
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("Error", e.message);
      } else {
        throw e;
      }
    }
  };

  const contentPlaceholder =
    mode === "CHORD_PRO"
      ? "You can edit any song here\n" +
        "U[C]sing the [Dm]chordPro format[G]\n\n\n"
      : "You can edit any song here\n" +
        " C              Dm          G\n" +
        "Using the chord sheet format\n\n\n";

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PageView hasNoFooter>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardDismissMode="none">
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "height" : "padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}>
          {error !== null && <Text style={{ color: "red" }}>{error}</Text>}
          <TextInput
            mode={"outlined"}
            style={{ textAlign: "auto" }}
            label={t("song_title")}
            // autoFocus={false}
            autoCorrect={false}
            autoCapitalize="words"
            onChangeText={setTitle}
            value={title}
          />
          <TextInput
            mode={"outlined"}
            style={{ textAlign: "auto" }}
            label={t("artist_name")}
            // autoFocus={false}
            autoCorrect={false}
            autoCapitalize="words"
            onChangeText={setArtist}
            value={artist}
          />
          <TextInput
            mode={"outlined"}
            style={{ textAlign: "auto" }}
            dense={true}
            label={t("source_label")}
            // autoFocus={false}
            autoCorrect={false}
            autoCapitalize="words"
            onChangeText={setSourceLabel}
            value={sourceLabel}
          />
          <TextInput
            mode={"outlined"}
            style={{ textAlign: "auto" }}
            dense={true}
            label={t("source_url")}
            // autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setSourceUrl}
            value={sourceUrl}
          />
          <TextInputModal
            error={error}
            enabled={isReplaceModalOpen}
            onDismiss={() => {
              setError(null);
              setReplaceModalOpen(false);
            }}
            onChange={value => setReplaceWithText(value)}
            onSubmit={doReplaceText}
            submitButtonTitle={`${t("replace").toUpperCase()}`}
            placeholder={"Enter replacement text"}
          />
          <TextInputModal
            error={error}
            enabled={isAddChordNotesModalOpen}
            onDismiss={() => {
              setError(null);
              setAddChordNotesModalOpen(false);
            }}
            onChange={value => setAddChordNotesText(value)}
            onSubmit={doAddChordNotes}
            submitButtonTitle={`${t("add_chord_using_notes").toUpperCase()}`}
            placeholder={"e.g. A C E G is Am7"}
          />
          <TextInputModal
            error={error}
            enabled={isAddChordModalOpen}
            onDismiss={() => {
              setError(null);
              setAddChordModalOpen(false);
            }}
            onChange={value => setAddChordText(value)}
            onSubmit={doAddChord}
            submitButtonTitle={`${t("add_chord").toUpperCase()}`}
            placeholder={"e.g. Am7/C"}
          />
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={
                mode === "CHORD_PRO"
                  ? [
                      styles.tabActive,
                      { backgroundColor: colors.secondaryContainer },
                    ]
                  : [
                      styles.tabInactive,
                      { backgroundColor: colors.primaryContainer },
                    ]
              }
              onPress={switchToChordPro}
              disabled={mode === "CHORD_PRO"}>
              <Text
                style={
                  mode === "CHORD_PRO"
                    ? [{ color: colors.onSecondaryContainer }]
                    : [{ color: colors.onSurfaceDisabled }]
                }>
                ChordPro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                mode === "CHORD_SHEET"
                  ? [
                      styles.tabActive,
                      { backgroundColor: colors.secondaryContainer },
                    ]
                  : [
                      styles.tabInactive,
                      { backgroundColor: colors.primaryContainer },
                    ]
              }
              onPress={switchToChordSheet}
              disabled={mode === "CHORD_SHEET"}>
              <Text
                style={
                  mode === "CHORD_SHEET"
                    ? [{ color: colors.onSecondaryContainer }]
                    : [{ color: colors.onSurfaceDisabled }]
                }>
                {t("chords_over_lyrics")}
              </Text>
            </TouchableOpacity>
          </View>
          <NativeTextInput
            // ref={nativeTextInputRef}
            textAlignVertical="top"
            style={[
              styles.content,
              {
                backgroundColor: colors.background,
                color: colors.onBackground,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            placeholder={contentPlaceholder}
            placeholderTextColor={colors.onSurface}
            numberOfLines={4}
            multiline={true}
            // autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setContent}
            value={content}
            // selection={selection} // cannot use this prop without the cursor jumping around
            onSelectionChange={event => {
              const {
                nativeEvent: {
                  selection: { start, end },
                },
              } = event;
              setSelection({ start, end });
            }}
            onFocus={() => setIsChordsFieldFocused(true)}
            onBlur={() => setIsChordsFieldFocused(false)}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  tabsContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  tabActive: {
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  content: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    minHeight: 200,
    padding: 10,
  },
});

export default SongEdit;
