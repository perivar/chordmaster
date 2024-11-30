import { FunctionComponent, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

import ErrorText from "../../components/ErrorText";
import PageView from "../../components/PageView";
import TouchableIcon from "../../components/TouchableIcon";
import useFirestore, { ISong } from "../../hooks/useFirestore";
import useFirestoreReduxMethods from "../../hooks/useFirestoreReduxMethods";
import { useLocalization } from "../../hooks/useLocalization";
import { useTheme } from "../../hooks/useTheme";
import {
  addOrUpdatePlaylistReducer,
  editPlaylistReducer,
} from "../../redux/slices/library";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { RootStackParamList } from "../../types/types";
import DraggableItem from "./components/DraggableItem";

type PlaylistEditScreenRouteProp = RouteProp<
  RootStackParamList,
  "PlaylistEdit"
>;
type PlaylistEditScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PlaylistEdit"
>;
type Props = {
  route: PlaylistEditScreenRouteProp;
  navigation: PlaylistEditScreenNavigationProp;
};

const HEADER_HEIGHT = 60;

const PlaylistEdit: FunctionComponent<Props> = (props: Props) => {
  const { navigation, route } = props;

  const playlistIdParam = route.params.id;

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const allSongs = useAppSelector(state => state.library.songs);
  const allPlaylists = useAppSelector(state => state.library.playlists);
  const playlist = allPlaylists.find(a => a.id === playlistIdParam);

  const [name, setName] = useState(playlist?.name);
  // const [songs, setSongs] = useState<ISong[]>(playlist.songs);
  // const songs = allSongs.filter(result => playlist.songIds.includes(result.id));

  // Use type guard to filter out undefined values
  const notUndefined = (anyValue: ISong | undefined): anyValue is ISong =>
    anyValue !== undefined;
  const songs = playlist?.songIds
    .map(id => allSongs.find(s => s.id === id))
    .filter(notUndefined);

  const [error, setError] = useState<string | null>(null);

  const { editPlaylist } = useFirestore();

  const { hasPlaylistContainsSong, playlistRemoveSong, loadPlaylistData } =
    useFirestoreReduxMethods();

  const onPressCancel = async () => {
    // reset from database, since we are not updating the order
    loadPlaylistData(playlistIdParam);

    navigation.goBack();
  };

  const onPressSavePlaylist = async () => {
    try {
      if (songs && playlist && playlist.id) {
        const songIds = songs
          .map(s => s.id)
          .filter((id): id is string => typeof id === "string");

        const newPlaylist = await editPlaylist(
          playlist.id,
          name ?? "",
          songIds
        );
        // console.log('onPressSavePlaylist:', newPlaylist);

        await dispatch(addOrUpdatePlaylistReducer(newPlaylist));

        navigation.goBack();
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        throw e;
      }
    }
  };

  const onPressRemoveSong = async (song: ISong) => {
    console.log("onPressRemoveSong:", song.id);

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
        setError(
          "Could not remove song from playlist since its not a part of the playlist!"
        );
      }
    }
  };

  const onUpdatePlaylistSongOrder = async (songsOrdered: ISong[]) => {
    if (playlist) {
      console.log("Original playlist song order:", playlist.songIds);

      // new order
      const songIds = songsOrdered
        .map(s => s.id)
        .filter((id): id is string => typeof id === "string");
      console.log("Updating playlist song order:", songIds);

      const newPlaylist = { ...playlist };
      newPlaylist.songIds = [...songIds];
      dispatch(editPlaylistReducer(newPlaylist));
    }
  };

  const renderItem = ({ item, drag }: RenderItemParams<ISong>) => {
    return (
      <DraggableItem
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.onBackground,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        title={item.title}
        subtitle={item.artist.name}
        onPressDelete={() => onPressRemoveSong(item)}
        onDragStart={drag}
        onDragEnd={() => {
          console.log("drag end");
        }}
      />
    );
  };

  if (!songs) return null;

  return (
    <PageView hasNoHeader>
      <View style={styles.header}>
        <TouchableIcon
          name="close"
          onPress={onPressCancel}
          color={colors.onBackground}
        />
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>
          {t("playlist_edit")}
        </Text>
        <TouchableIcon
          name="check"
          onPress={onPressSavePlaylist}
          color={colors.onBackground}
        />
      </View>
      <View style={styles.playlistNameInputContainer}>
        <TextInput
          style={[
            styles.playlistNameInput,
            {
              color: colors.onBackground,
              borderBottomColor: colors.onBackground,
            },
          ]}
          value={name}
          onChangeText={value => setName(value)}
          placeholder={t("playlist_name")}
        />
        <ErrorText>{error}</ErrorText>
      </View>
      <DraggableFlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => `draggable-item-${item.id}`}
        onDragEnd={({ data }) => {
          if (data !== null) {
            onUpdatePlaylistSongOrder(data);
          }
        }}
      />
    </PageView>
  );
};

export default PlaylistEdit;

const styles = StyleSheet.create({
  playlistNameInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistNameInput: {
    fontSize: 22,
    textAlign: "center",
    borderBottomWidth: 2,
    maxWidth: 250,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: HEADER_HEIGHT,
  },
});
