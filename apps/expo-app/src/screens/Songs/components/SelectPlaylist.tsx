import { FC, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import useFirestore from "@/hooks/useFirestore";
import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import ListItem from "@/components/ListItem";
import TextInputModal from "@/components/TextInputModal";
import { useDimensions } from "@/utils/useDimensions";

import { userSelector } from "@/redux/slices/auth";
import { addOrUpdatePlaylistReducer } from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

interface Props {
  show: boolean;
  songId: string;
  onPressClose: () => void;
}

const HEADER_HEIGHT = 30;

const SelectPlaylist: FC<Props> = ({ show, songId, onPressClose }) => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const allPlaylists = useAppSelector(state => state.library.playlists);
  const allSongs = useAppSelector(state => state.library.songs);

  const playlists = allPlaylists;
  const song = allSongs.find(s => s.id === songId);

  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dimensionsData = useDimensions();
  const windowHeight = dimensionsData.windowData.height;
  const scrollHeaderHeight = windowHeight * 0.6 - HEADER_HEIGHT;
  const listContainerHeight = windowHeight - scrollHeaderHeight - HEADER_HEIGHT;

  const { addNewPlaylist } = useFirestore();

  const { hasPlaylistContainsSong, playlistAddSong, playlistRemoveSong } =
    useFirestoreReduxMethods();

  const onSelectPlaylist = async (id: string) => {
    console.log("Selecting playlist:", id);
    const playlist = allPlaylists.find(a => a.id === id);

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
    // setPlaylists(Playlist.getAll());
  };

  const enablePlaylistInput = () => {
    setError(null);
    setShowInput(true);
  };

  const onSubmit = async (playlistName: string) => {
    try {
      if (playlistName === "") {
        throw new Error(t("empty_name_not_allowed"));
      }

      if (song && user && user.uid) {
        const playlist = await addNewPlaylist(
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          playlistName,
          []
        );

        console.log("onSubmit -> addNewPlaylist:", playlist.id);

        await dispatch(addOrUpdatePlaylistReducer(playlist));

        setShowInput(false);
        // setPlaylists(Playlist.getAll());
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        throw e;
      }
    }
  };

  if (!show) return null;
  if (showInput)
    return (
      <TextInputModal
        error={error}
        enabled={showInput}
        onDismiss={() => {
          setError(null);
          setShowInput(false);
        }}
        onSubmit={onSubmit}
        submitButtonTitle={t("create").toUpperCase()}
        placeholder={t("playlist_name")}
      />
    );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[styles.scrollHeader, { height: scrollHeaderHeight }]}>
        <TouchableOpacity
          onPress={onPressClose}
          style={styles.scrollHeaderTouchableBackground}
        />
      </View>
      <View
        style={[
          {
            minHeight: listContainerHeight,
            backgroundColor: colors.background,
          },
        ]}>
        <TouchableOpacity
          onPress={enablePlaylistInput}
          style={[
            styles.createPlaylistButton,
            { borderBottomColor: colors.onBackground },
          ]}>
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={colors.onBackground}
          />
          <Text
            style={[
              styles.createPlaylistButtonText,
              { color: colors.onBackground },
            ]}>
            {t("create_new_playlist").toUpperCase()}
          </Text>
        </TouchableOpacity>
        {!playlists ||
          (playlists && playlists.length <= 0 && (
            <Text style={[styles.emptyMessage, { color: colors.error }]}>
              {t("playlists_not_found")}
            </Text>
          ))}
        {playlists.map(item => {
          return (
            <ListItem
              containerStyle={{
                backgroundColor: colors.background,
                borderBottomColor: colors.surfaceDisabled,
              }}
              textStyle={{ color: colors.onBackground }}
              iconColor={colors.onBackground}
              key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id!)}
              showIcon={
                hasPlaylistContainsSong(item.id!, song!.id!) ? "check" : "plus"
              }
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default SelectPlaylist;

const styles = StyleSheet.create({
  scrollContainer: {
    position: "absolute",
    backgroundColor: "#00000040",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    zIndex: 999,
  },
  scrollHeader: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollHeaderTouchableBackground: {
    flex: 1,
  },
  createPlaylistButton: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  createPlaylistButtonText: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    fontSize: 14,
  },
  emptyMessage: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
