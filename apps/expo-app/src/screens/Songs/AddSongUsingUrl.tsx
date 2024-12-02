import { FunctionComponent, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { fetchSongData } from "@chordmaster/utils";
import { router } from "expo-router";

import useFirestore, { IArtist } from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageView from "@/components/PageView";
import PrimaryButton from "@/components/PrimaryButton";
import SearchBar from "@/components/SearchBar";

import { SIZES } from "@/constants/theme";
import { userSelector } from "@/redux/slices/auth";
import {
  addOrUpdateArtistReducer,
  addOrUpdateSongReducer,
} from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const AddSongUsingUrl: FunctionComponent = () => {
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
        const { artist, songName, chordPro, source } =
          await fetchSongData(query);

        // console.log(chordPro);
        setMessage(chordPro);

        await addSong(songName, artist, chordPro, undefined, query, source);

        setQuery("");
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

      router.replace({
        pathname: "/songs/[id]",
        params: { id: newSong!.id!, title: newSong.title },
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
