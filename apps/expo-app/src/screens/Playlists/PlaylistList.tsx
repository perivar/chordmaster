import { FunctionComponent, useState } from "react";
import { Alert, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import useBundler from "@/hooks/useBundler";
import useFirestore from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import CustomHeader from "@/components/CustomHeader";
import EmptyListMessage from "@/components/EmptyListMessage";
import ListItem from "@/components/ListItem";
import PageView from "@/components/PageView";
import TextInputModal from "@/components/TextInputModal";
import TouchableIcon from "@/components/TouchableIcon";
import { exportFile } from "@/utils/exportFile";
import { verifyUserClick } from "@/utils/verifyUserClick";

import { userSelector } from "@/redux/slices/auth";
import {
  addOrUpdatePlaylistReducer,
  deletePlaylistReducer,
} from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const PlaylistList: FunctionComponent = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const allPlaylists = useAppSelector(state => state.library.playlists);

  const playlists = allPlaylists;

  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { deletePlaylist, addNewPlaylist } = useFirestore();

  const { createBundle } = useBundler();

  const onSelectPlaylist = (id: string, name: string) => {
    router.navigate({
      pathname: "/playlists/[id]",
      params: { id, title: name },
    });
  };

  const onPressDeletePlaylist = (id: string) => {
    verifyUserClick(
      "Delete Playlist",
      "Are you sure you want to permanently delete it?",
      async () => {
        await deletePlaylist(id);
        dispatch(deletePlaylistReducer(id));
      },
      () => {
        // setPlaylists(Playlist.getAll());
        console.log("deletePlaylist done!");
      }
    );
  };

  const onPressShare = async (id: string, name: string) => {
    try {
      const bundle = await createBundle([id], []);
      const bundleString = JSON.stringify(bundle);

      const filename = "playlist_" + name.toLowerCase();

      await exportFile(
        "documents",
        "ChordMaster",
        filename,
        ".txt",
        bundleString
      );
    } catch (err) {
      Alert.alert("Error", JSON.stringify(err));
      console.warn(err);
    }
  };

  const onSubmit = async (playlistName: string) => {
    try {
      if (playlistName === "") {
        throw new Error(t("empty_name_not_allowed"));
      }

      if (user && user.uid) {
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

        setShowAddPlaylistModal(false);
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

  return (
    <PageView hasNoHeader>
      <CustomHeader
        containerStyle={{ backgroundColor: colors.background }}
        titleStyle={{ color: colors.onBackground }}
        title={t("playlists")}
        headerRight={
          <TouchableIcon
            onPress={() => setShowAddPlaylistModal(true)}
            name="plus"
            color={colors.onBackground}
          />
        }
      />
      <TextInputModal
        error={error}
        enabled={showAddPlaylistModal}
        onDismiss={() => {
          setError(null);
          setShowAddPlaylistModal(false);
        }}
        onSubmit={onSubmit}
        submitButtonTitle={t("create").toUpperCase()}
        placeholder={t("playlist_name")}
      />
      <FlashList
        data={playlists}
        estimatedItemSize={playlists.length || 1}
        extraData={colors}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListEmptyComponent={
          <EmptyListMessage
            textStyle={{ color: colors.onBackground }}
            message={t("you_havent_created_any_playlist_yet")}
            onPress={() => setShowAddPlaylistModal(true)}
            buttonTitle={t("create_new_playlist").toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              containerStyle={{
                backgroundColor: colors.background,
                borderBottomColor: colors.surfaceDisabled,
              }}
              textStyle={{ color: colors.onBackground }}
              optionMenuStyle={{
                backgroundColor: colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: colors.surfaceDisabled,
              }}
              iconColor={colors.onBackground}
              // key={item.id!}
              title={item.name}
              onPress={() => onSelectPlaylist(item.id!, item.name)}
              options={[
                {
                  title: t("share"),
                  onPress: () => onPressShare(item.id!, item.name),
                },
                {
                  title: t("delete"),
                  onPress: () => onPressDeletePlaylist(item.id!),
                },
              ]}
            />
          );
        }}
      />
    </PageView>
  );
};

export default PlaylistList;
