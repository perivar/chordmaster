import { FunctionComponent, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import {
  CustomUltimateGuitarParser,
  CustomUltimateGuitarRawParser,
  getAZChordContent,
  parseUltimateGuitar,
} from "@chordmaster/utils";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ChordSheetJS from "chordsheetjs";

import useFirestore, { IArtist } from "../hooks/useFirestore";
import { useLocalization } from "../hooks/useLocalization";
import { useTheme } from "../hooks/useTheme";
import LoadingIndicator from "../components/LoadingIndicator";
import PageView from "../components/PageView";
import PrimaryButton from "../components/PrimaryButton";
import SearchBar from "../components/SearchBar";

import { MainTabParamList, RootStackParamList } from "../types/types";
import { SIZES } from "../constants/theme";
import { userSelector } from "../redux/slices/auth";
import {
  addOrUpdateArtistReducer,
  addOrUpdateSongReducer,
} from "../redux/slices/library";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";

type AddSongUsingUrlScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "SongList">,
  StackNavigationProp<RootStackParamList, "MainTab">
>;

type Props = {
  navigation: AddSongUsingUrlScreenNavigationProp;
};

const AddSongUsingUrl: FunctionComponent<Props> = props => {
  const { navigation } = props;
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);

  const searchInput = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const { addNewSong, getArtistsByName, addNewArtist } = useFirestore();

  const importUrl = async () => {
    if (query.length > 0) {
      const fetchData = async () => {
        // example urls:
        // azchords:
        // https://www.chordie.com/chord.pere/www.azchords.com/b/billyjoel-tabs-473/justthewayyouare-tabs-894021.html
        // https://www.azchords.com/b/billyjoel-tabs-473/justthewayyouare-tabs-894021.html

        // const url =
        //   'https://www.azchords.com/b/billyjoel-tabs-473/justthewayyouare-tabs-894021.html';
        // const url =
        //   'https://www.azchords.com/r/robbiewilliams-tabs-3334/somethingstupid-tabs-510860.html';
        // const url =
        //   'https://www.azchords.com/c/catstevens-tabs-722/moonshadow1-tabs-451195.html';
        // const url =
        //   'https://www.azchords.com/c/catstevens-tabs-722/moonshadow-tabs-211671.html';

        // ultimate-guitar.com:
        // const url = 'https://tabs.ultimate-guitar.com/tab/266333';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/cat-stevens/wild-world-chords-992169';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/celine-dion/all-by-myself-chords-66364';
        // const url =
        // 'https://tabs.ultimate-guitar.com/tab/frank-sinatra/the-way-you-look-tonight-chords-742402';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/elton-john/sorry-seems-to-be-the-hardest-word-chords-998401';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/michael_jackson/man_in_the_mirror_chords_517579';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/sinach/way-maker-chords-2405347';
        // const url =
        //   'https://tabs.ultimate-guitar.com/tab/chris-tomlin/how-great-is-our-god-chords-166109';

        // const url =
        //   'https://raw.githubusercontent.com/pathawks/Christmas-Songs/master/Angels%20From%20The%20Realms%20Of%20Glory.cho';
        // const url =
        //   'https://raw.githubusercontent.com/pathawks/Christmas-Songs/master/First%20Nowell.cho';
        // const url =
        //   'https://raw.githubusercontent.com/pathawks/Christmas-Songs/master/Hark%20the%20Herald%20Angels%20Sing.cho';

        // to avoid truncating log files, log to a json server
        // step 1:  install json server globally:
        //          yarn global add json-server
        // step 2:  create a new file for logs:
        //          echo '{"logs": []}'> logs.json
        // step 3:  start json-server:
        //          json-server logs.json
        // step 4:  log to server from client app:
        // axios.post('http://localhost:3000/logs', {
        //   date: new Date(),
        //   msg: content,
        // });

        const url = query;

        const header = {
          method: "GET",
          headers: {},
        };

        const fetchResult = await fetch(url, header);

        if (url.startsWith("https://www.azchords.com")) {
          const htmlResult = await fetchResult.text();
          // console.log('html', htmlResult);

          const { artist, songName, cleanedContent } =
            getAZChordContent(htmlResult);

          if (!artist || !songName || !cleanedContent) {
            throw new Error(
              "Returned undefined for artist, song name or content!"
            );
          }

          const chordSheetSong = new CustomUltimateGuitarParser({
            preserveWhitespace: false,
          }).parse(cleanedContent);

          const chordPro = new ChordSheetJS.ChordProFormatter().format(
            chordSheetSong
          );

          // console.log(chordPro);
          setMessage(chordPro);

          await addSong(songName, artist, chordPro, undefined, url, "azchords");

          setQuery("");
        } else if (url.startsWith("https://tabs.ultimate-guitar.com/")) {
          const htmlResult = await fetchResult.text();
          // console.log('html', htmlResult);

          // const { artist, songName, cleanedContent } =
          //   getUltimateGuitarContent(htmlResult);

          // let chordSheetSong = new CustomUltimateGuitarParser({
          //   preserveWhitespace: false,
          // }).parse(cleanedContent);

          // converted to use raw ultimate guitar format (i.e. with [tab] and [ch] tags)
          const { artist, songName, content } = parseUltimateGuitar(htmlResult);

          if (!artist || !songName || !content) {
            throw new Error(
              "Returned undefined for artist, song name or content!"
            );
          }

          const chordSheetSong = new CustomUltimateGuitarRawParser({
            preserveWhitespace: false,
          }).parse(content);

          const chordPro = new ChordSheetJS.ChordProFormatter().format(
            chordSheetSong
          );
          // console.log(chordPro);

          setMessage(chordPro);

          await addSong(
            songName,
            artist,
            chordPro,
            undefined,
            url,
            "ultimate-guitar"
          );

          setQuery("");
        } else if (
          url.startsWith("https://raw.githubusercontent.com/pathawks/")
        ) {
          const chordPro = await fetchResult.text();
          console.log("chordPro", chordPro);

          // get artist and title from the chord pro song
          const s = new ChordSheetJS.ChordProParser().parse(chordPro);

          const title = Array.isArray(s.title) ? s.title[0] : (s.title ?? "");
          const artist = Array.isArray(s.artist)
            ? s.artist[0]
            : (s.artist ?? "Public Domain");

          setMessage(chordPro);

          await addSong(
            title,
            artist,
            chordPro,
            undefined,
            url,
            "Public Domain Christmas Songs"
          );

          setQuery("");
        }
      };

      try {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        await fetchData();
        setIsLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setIsLoading(false);
          setError(e.message);
        } else {
          throw e;
        }
      }
    } else {
      // nothing added
      setError(t("missing_url_error"));
    }
  };

  const addSong = async (
    title: string,
    artist: string,
    content: string,

    externalId?: string,
    externalUrl?: string,
    externalSource?: string
  ) => {
    if (title.trim() === "") return setError(t("invalid_title"));
    if (artist.trim() === "") return setError(t("invalid_artist"));
    if (content.trim() === "") return setError(t("invalid_content"));

    const artistName = artist.trim();
    const songTitle = title.trim();
    const chordPro = content;

    try {
      if (!user) throw new Error("User object is undefined!");

      let artistDb: IArtist;
      const artists = await getArtistsByName(artistName);
      if (artists && artists.length > 0) {
        artistDb = artists[0];
      } else {
        artistDb = await addNewArtist(artistName);
        await dispatch(addOrUpdateArtistReducer(artistDb));
      }

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

        externalId,
        externalUrl,
        externalSource
      );

      // console.log('AddSongUsingUrl -> addSong:', newSong);

      await dispatch(addOrUpdateSongReducer(newSong));

      navigation.replace("SongView", {
        id: newSong!.id!,
        title: newSong.title,
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        throw e;
      }
    }
  };

  return (
    <PageView>
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={importUrl}
        onChangeText={value => setQuery(value)}
        query={query}
        placeholder={t("add_using_url")}
      />
      <Text
        style={{
          textAlign: "center",
          color: colors.onBackground,
          paddingHorizontal: SIZES.padding,
        }}>
        {t("supported_add_url_sites")}
      </Text>
      <View
        style={{
          backgroundColor: colors.background,
          padding: SIZES.padding,
        }}>
        <PrimaryButton onPress={importUrl} title={t("import_from_url")} />
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            color: colors.error,
            paddingHorizontal: SIZES.padding,
            paddingVertical: 10,
          }}>
          {error}
        </Text>
      </View>
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: 14,
          color: colors.onBackground,
          paddingHorizontal: 5,
          paddingTop: 10,
        }}>
        {message}
      </Text>
      <LoadingIndicator error={error} loading={isLoading} />
    </PageView>
  );
};

export default AddSongUsingUrl;
