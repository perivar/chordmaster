import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";

import { ISong } from "../hooks/useFirestore";
import useFirestoreReduxMethods from "../hooks/useFirestoreReduxMethods";
import { useLocalization } from "../hooks/useLocalization";
import { useTheme } from "../hooks/useTheme";
import EmptyListMessage from "../components/EmptyListMessage";
import ListItem from "../components/ListItem";
import SearchBar from "../components/SearchBar";

import { MainTabParamList, RootStackParamList } from "../types/types";
import { useAppSelector } from "../redux/store/hooks";

type PlaylistAddSongsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "PlaylistAddSongs">,
  BottomTabNavigationProp<MainTabParamList, "PlaylistList">
>;
type PlaylistAddSongsScreenRouteProp = RouteProp<
  RootStackParamList,
  "PlaylistAddSongs"
>;

type Props = {
  route: PlaylistAddSongsScreenRouteProp;
  navigation: PlaylistAddSongsScreenNavigationProp;
};

const PlaylistAddSongs = (props: Props) => {
  const { navigation, route } = props;

  const idParam = route.params.id;

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const allSongs = useAppSelector(state => state.library.songs);
  const allPlaylists = useAppSelector(state => state.library.playlists);
  const playlist = allPlaylists.find(a => a.id === idParam);

  const [songs, setSongs] = useState<ISong[]>(allSongs);
  const [query, setQuery] = useState("");

  const [error, setError] = useState<string | null>(null);
  const searchInput = useRef<TextInput>(null);

  const { hasPlaylistContainsSong, playlistAddSong, playlistRemoveSong } =
    useFirestoreReduxMethods();

  useEffect(() => {
    if (query !== "") {
      const filteredSongs = allSongs.filter(
        s =>
          s.title.toLowerCase().includes(query) ||
          s.artist.name.toLowerCase().includes(query)
      );
      setSongs(filteredSongs);
    } else {
      // reset query
      setSongs(allSongs);
    }
  }, [query, allSongs]);

  const onSelectSong = async (id: string, _: string) => {
    // console.log('Selecting song:', title);
    const song = allSongs.find(s => s.id === id);
    if (song && song.id && playlist && playlist.id) {
      if (hasPlaylistContainsSong(playlist.id, song.id)) {
        try {
          await playlistRemoveSong(playlist.id, song.id);
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            throw e;
          }
        }
      } else {
        try {
          await playlistAddSong(playlist.id, song.id);
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            throw e;
          }
        }
      }
    }
  };

  const onSubmitEditing = () => {};

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        inputRef={searchInput}
        onSubmitEditing={onSubmitEditing}
        onChangeText={value => setQuery(value)}
        query={query}
        placeholder={t("search")}
      />
      {error !== null && <Text style={{ color: "red" }}>{error}</Text>}
      <FlashList
        data={songs}
        estimatedItemSize={songs.length || 1}
        extraData={{ colors, allSongs }}
        ListEmptyComponent={
          <EmptyListMessage
            textStyle={{ color: colors.onBackground }}
            message={t("you_havent_downloaded_any_song_yet")}
            onPress={() => {
              navigation.navigate("OnlineSearch");
            }}
            buttonTitle={t("go_to_online_search").toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          if (!playlist || !playlist.id || !playlist.songIds || !item.id) {
            return null; // Handle undefined playlist or songIds safely
          }

          const isInPlaylist = hasPlaylistContainsSong(playlist.id, item.id);

          return (
            <ListItem
              containerStyle={{
                backgroundColor: colors.background,
                borderBottomColor: colors.surfaceDisabled,
              }}
              textStyle={{ color: colors.onBackground }}
              iconColor={colors.onBackground}
              // key={item.id!}
              title={item.title}
              subtitle={item.artist.name}
              onPress={() => onSelectSong(item.id!, item.title)}
              showIcon={isInPlaylist ? "check" : "plus"}
            />
          );
        }}
      />
    </View>
  );
};

export default PlaylistAddSongs;
