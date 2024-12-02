import {
  FC,
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import { clamp } from "@chordmaster/utils";
import { Chord } from "chordsheetjs";
import { useKeepAwake } from "expo-keep-awake";
import { router, useNavigation } from "expo-router";
import { ActivityIndicator, Switch } from "react-native-paper";

import useFirestore from "@/hooks/useFirestore";
import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import AutoScrollSlider from "@/components/AutoScrollSlider";
import ChordTab from "@/components/ChordTab";
import LinkButton from "@/components/LinkButton";
import PageView from "@/components/PageView";
import SongRender, { SongRenderRef } from "@/components/SongRender";
import SongTransformer from "@/components/SongTransformer";
import TouchableIcon, { TouchableIconProps } from "@/components/TouchableIcon";
import { getChordPro } from "@/utils/getChordPro";

import {
  FONT_SIZE_STEP,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from "../Settings/FontSizeSelect";
import PageTurner from "./components/PageTurner";
import SelectPlaylist from "./components/SelectPlaylist";
import SideMenu from "./components/SideMenu";
import { userAppConfigSelector } from "@/redux/slices/config";
import { editSongReducer } from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const ToolButton: FC<TouchableIconProps> = ({ onPress, name, color }) => (
  <TouchableIcon
    style={{
      borderWidth: 1,
      borderRadius: 5,
      marginLeft: 8,
      borderColor: color,
    }}
    size={25}
    onPress={onPress}
    name={name}
    color={color}
  />
);

const Divider: FC = () => (
  <View style={{ borderBottomWidth: 0.5, borderColor: "#00000020" }} />
);

type Props = { id: string };

const SongView: FunctionComponent<Props> = props => {
  const { id: songIdParam } = props;
  const navigation = useNavigation();

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  // make sure this page never locks automatically, but is kept open
  useKeepAwake();

  const dispatch = useAppDispatch();
  const userAppConfig = useAppSelector(userAppConfigSelector);
  const allSongs = useAppSelector(state => state.library.songs);

  const song = allSongs.find(s => s.id === songIdParam);

  const [fontSize, setFontSize] = useState<number>(userAppConfig.fontSize);
  const [showTabs, setShowTabs] = useState(userAppConfig.showTablature);
  const [showPageTurner, setShowPageTurner] = useState(
    userAppConfig.enablePageTurner
  );

  const [content, setContent] = useState<string>("");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [tone, setTone] = useState<number>(0);
  const [showAutoScrollSlider, setShowAutoScrollSlider] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0);
  const [selectedChord, selectChord] = useState<Chord | null>(null);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [showPiano, setShowPiano] = useState(true);

  const songRenderRef = useRef<SongRenderRef>(null);

  const { setSongPreferences } = useFirestore();
  const { isLoading, loadSongData } = useFirestoreReduxMethods();

  useEffect(() => {
    if (!song) {
      loadSongData(songIdParam);
    }
  }, [songIdParam]);

  useEffect(() => {
    if (song) {
      setContent(getChordPro(song));

      if (song.transposeAmount !== undefined) {
        setTone(song.transposeAmount);
      }

      if (song.fontSize !== undefined) {
        setFontSize(song.fontSize);
      }

      if (song.showTablature !== undefined) {
        setShowTabs(song.showTablature);
      }
    }
  }, [song]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.flexRow}>
          <TouchableIcon
            onPress={editSong}
            name="pencil"
            color={colors.onBackground}
          />
          <TouchableIcon
            onPress={openSideMenu}
            name="dots-horizontal"
            color={colors.onBackground}
          />
        </View>
      ),
    });
  }, [navigation, isSideMenuOpen, colors.onBackground]);

  const changeTone = async (amount: number) => {
    setTone(amount);
    if (songIdParam && song) {
      await setSongPreferences(songIdParam, { transposeAmount: amount });

      // update the song in redux with the preferences
      const newSong = { ...song };
      newSong.transposeAmount = amount;
      dispatch(editSongReducer(newSong));
    }
  };

  const transposeUp = () => {
    changeTone(tone + 1 >= 12 ? 0 : tone + 1);
    selectChord(null);
  };

  const transposeDown = () => {
    changeTone(tone - 1 <= -12 ? 0 : tone - 1);
    selectChord(null);
  };

  const changeFontSize = async (amount: number) => {
    const newFontSize = clamp(fontSize + amount, MIN_FONT_SIZE, MAX_FONT_SIZE);
    setFontSize(newFontSize);

    if (songIdParam && song) {
      await setSongPreferences(songIdParam, { fontSize: newFontSize });

      // update the song in redux with the preferences
      const newSong = { ...song };
      newSong.fontSize = newFontSize;
      dispatch(editSongReducer(newSong));
    }
  };

  const increaseFontSize = async () => {
    await changeFontSize(FONT_SIZE_STEP);
  };

  const decreaseFontSize = async () => {
    await changeFontSize(-FONT_SIZE_STEP);
  };

  const openSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const onPressNextPage = () => {
    if (songRenderRef.current) songRenderRef.current.nextPage();
  };

  const onPressPreviousPage = () => {
    if (songRenderRef.current) songRenderRef.current.previousPage();
  };

  const onChangeShowTabs = async (value: boolean) => {
    setShowTabs(value);

    if (songIdParam && song) {
      await setSongPreferences(songIdParam, { showTablature: value });

      // update the song in redux with the preferences
      const newSong = { ...song };
      newSong.showTablature = value;
      dispatch(editSongReducer(newSong));
    }
  };

  const onClickChord = (allChords: Chord[], chordString: string) => {
    const foundChord = allChords.find(c => c.toString() === chordString);
    if (foundChord) {
      selectChord(foundChord);
    } else {
      Alert.alert(t("info"), `${chordString} is not a valid chord`);
    }
  };

  const editSong = () => {
    router.replace({
      pathname: "/songs/[id]/edit",
      params: { id: songIdParam },
    });
  };

  const showTone = (tn: number) => {
    if (tn === 0) return null;
    if (tn > 0) return "+" + tn;
    return tn;
  };

  const onPressArtist = () => {
    if (!song) return;

    router.navigate({
      pathname: "/artists/[id]",
      params: { id: song.artist.id!, title: song.artist.name },
    });
  };

  const togglePageTurner = (value: boolean) => {
    if (value) {
      setShowAutoScrollSlider(false);
      setScrollSpeed(0);
    }
    setShowPageTurner(value);
  };

  const toggleShowPiano = (value: boolean) => {
    if (value) {
      setShowPiano(false);
    }
    setShowPiano(value);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PageView hasNoFooter>
      <SideMenu
        containerStyle={{ backgroundColor: colors.primaryContainer }}
        isOpen={isSideMenuOpen}
        onDismiss={() => {
          setIsSideMenuOpen(false);
        }}>
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text
              style={[
                styles.toolLabelSmall,
                { color: colors.onPrimaryContainer },
              ]}>
              {t("transpose")}
            </Text>
            <Text style={[styles.toolBadge, { color: colors.notification }]}>
              {showTone(tone)}
            </Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton
              onPress={transposeDown}
              name="minus"
              color={colors.onPrimaryContainer}
            />
            <ToolButton
              onPress={transposeUp}
              name="plus"
              color={colors.onPrimaryContainer}
            />
          </View>
        </View>
        <Divider />
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text
              style={[
                styles.toolLabelSmall,
                { color: colors.onPrimaryContainer },
              ]}>
              {t("text_size")}
            </Text>
            <Text style={[styles.toolBadge, { color: colors.notification }]}>
              {fontSize}
            </Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton
              onPress={decreaseFontSize}
              name="format-font-size-decrease"
              color={colors.onPrimaryContainer}
            />
            <ToolButton
              onPress={increaseFontSize}
              name="format-font-size-increase"
              color={colors.onPrimaryContainer}
            />
          </View>
        </View>
        <Divider />
        <TouchableHighlight
          underlayColor={colors.onPrimary}
          onPress={() => {
            setShowPageTurner(false);
            setIsSideMenuOpen(false);
            setShowAutoScrollSlider(true);
          }}
          style={styles.tool}>
          <Text
            style={[styles.toolLabel, { color: colors.onPrimaryContainer }]}>
            {t("auto_scroll")}
          </Text>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight
          underlayColor={colors.onPrimary}
          onPress={() => onChangeShowTabs(!showTabs)}>
          <View style={styles.tool}>
            <Text
              style={[styles.toolLabel, { color: colors.onPrimaryContainer }]}>
              {t("show_tabs")}
            </Text>
            <Switch onValueChange={onChangeShowTabs} value={showTabs} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight
          underlayColor={colors.onPrimary}
          onPress={() => togglePageTurner(!showPageTurner)}>
          <View style={styles.tool}>
            <Text
              style={[styles.toolLabel, { color: colors.onPrimaryContainer }]}>
              {t("page_turner")}
            </Text>
            <Switch onValueChange={togglePageTurner} value={showPageTurner} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight
          underlayColor={colors.onPrimary}
          onPress={() => toggleShowPiano(!showPiano)}>
          <View style={styles.tool}>
            <Text
              style={[styles.toolLabel, { color: colors.onPrimaryContainer }]}>
              {t("show_notes")}
            </Text>
            <Switch onValueChange={toggleShowPiano} value={showPiano} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight
          underlayColor={colors.onPrimary}
          onPress={() => {
            setIsSideMenuOpen(false);
            setShowPlaylistSelection(!showPlaylistSelection);
          }}>
          <View style={styles.tool}>
            <Text
              style={[styles.toolLabel, { color: colors.onPrimaryContainer }]}>
              {t("add_to_playlist")}
            </Text>
            <TouchableIcon
              onPress={() => {
                setIsSideMenuOpen(false);
                setShowPlaylistSelection(!showPlaylistSelection);
              }}
              size={25}
              name="playlist-plus"
              color={colors.onPrimaryContainer}
            />
          </View>
        </TouchableHighlight>
      </SideMenu>

      <SongTransformer
        chordProSong={content}
        transposeDelta={tone}
        showTabs={showTabs}
        fontSize={fontSize}>
        {songProps => (
          <View style={{ flex: 1 }}>
            <SongRender
              ref={songRenderRef}
              onPressArtist={onPressArtist}
              onPressChord={chordString =>
                onClickChord(songProps.chords, chordString)
              }
              chordProContent={songProps.htmlSong}
              scrollSpeed={scrollSpeed}
            />
            <LinkButton
              title={song?.external?.source}
              url={song?.external?.url}
            />
            <ChordTab
              showPiano={showPiano}
              onPressClose={() => selectChord(null)}
              selectedChord={selectedChord}
              allChords={songProps.chords}
              closeLabel={t("close")}
            />
            <AutoScrollSlider
              show={showAutoScrollSlider}
              onValueChange={setScrollSpeed}
              onClose={() => setShowAutoScrollSlider(false)}
            />
            <SelectPlaylist
              songId={songIdParam}
              show={showPlaylistSelection}
              onPressClose={() => setShowPlaylistSelection(false)}
            />
            <PageTurner
              show={showPageTurner}
              onPressNext={onPressNextPage}
              onPressPrevious={onPressPreviousPage}
            />
          </View>
        )}
      </SongTransformer>
    </PageView>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  tool: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toolButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolLabelSmall: {
    maxWidth: 100,
    paddingRight: 0,
    textTransform: "uppercase",
  },
  toolLabel: {
    position: "relative",
    textAlign: "left",
    textTransform: "uppercase",
    paddingVertical: 10,
  },
  toolBadge: {
    position: "absolute",
    top: -5,
    right: -15,
    width: 30,
    height: 20,
  },
});

export default SongView;
