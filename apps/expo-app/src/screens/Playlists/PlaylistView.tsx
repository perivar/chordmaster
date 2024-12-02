import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";

import useFirestore, { ISong } from "@/hooks/useFirestore";
import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import EmptyListMessage from "@/components/EmptyListMessage";
import ListItem, { LeftIconOptions } from "@/components/ListItem";
import PickerModal, { PickerOption } from "@/components/PickerModal";
import PrimaryButton from "@/components/PrimaryButton";
import TouchableIcon from "@/components/TouchableIcon";
import { verifyUserClick } from "@/utils/verifyUserClick";

import { deleteSongReducer } from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

type SortBy = "TITLE" | "ARTIST" | "CUSTOM";

type Props = {
  id: string;
};

const PlaylistView: FunctionComponent<Props> = (props: Props) => {
  const { id: playlistIdParam } = props;

  const navigation = useNavigation();

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const allSongs = useAppSelector(state => state.library.songs);
  const allPlaylists = useAppSelector(state => state.library.playlists);
  const playlist = allPlaylists.find(a => a.id === playlistIdParam);

  // Use type guard to filter out undefined values
  const notUndefined = (anyValue: ISong | undefined): anyValue is ISong =>
    anyValue !== undefined;
  const playlistSongs = playlist?.songIds
    .map(id => allSongs.find(s => s.id === id))
    .filter(notUndefined);

  const [songs, setSongs] = useState<ISong[]>(playlistSongs ?? []);
  const [name, setName] = useState(playlist?.name);

  const [enableSortSelect, setEnableSortSelect] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("CUSTOM");
  const [reverse, setReverse] = useState(false);
  const [sortOptions, setSortOptions] = useState<PickerOption<SortBy>[]>([]);

  const { deleteSong } = useFirestore();
  const { isLoading, loadPlaylistData } = useFirestoreReduxMethods();

  useEffect(() => {
    loadPlaylistData(playlistIdParam);
  }, []);

  useEffect(() => {
    const sortOptionsValues: { label: string; value: SortBy }[] = [
      { label: t("custom_sort"), value: "CUSTOM" },
      { label: t("sort_by_title"), value: "TITLE" },
      { label: t("sort_by_artist"), value: "ARTIST" },
    ];

    const newOptions: PickerOption<SortBy>[] = sortOptionsValues.map(
      ({ label, value }) => {
        let leftIcon: LeftIconOptions = "empty-space";
        if (value === sortBy) {
          if (value === "CUSTOM") {
            leftIcon = "arrow-down";
          } else {
            leftIcon = reverse ? "arrow-up" : "arrow-down";
          }
        }
        return { label, leftIcon, value, key: "sort-" + value };
      }
    );

    setSortOptions(newOptions);
    const sortedSongs = getSortedSongs();
    setSongs(sortedSongs ?? []);
  }, [reverse, sortBy, t]);

  useFocusEffect(
    useCallback(() => {
      setSongs(playlistSongs ?? []);
      setName(playlist?.name);
    }, [playlist])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        <TouchableIcon
          onPress={onPressEditPlaylist}
          name="pencil"
          color={colors.onBackground}
        />
      ),
    });
  }, [colors.onBackground, name]);

  const getSortedSongs = () => {
    let s = playlistSongs;
    if (s instanceof Array) {
      const asc = reverse ? -1 : 1;
      if (sortBy === "ARTIST") {
        s = s.sort((a, b) => {
          if (a.artist.name < b.artist.name) {
            return asc * -1;
          }
          if (a.artist.name > b.artist.name) {
            return asc * 1;
          }
          return 0;
        });
      } else if (sortBy === "TITLE") {
        s = s.sort((a, b) => {
          if (a.title < b.title) {
            return asc * -1;
          }
          if (a.title > b.title) {
            return asc * 1;
          }
          return 0;
        });
      }
    }
    return s;
  };

  const onSelectSong = (id: string, title: string) => {
    router.navigate({
      pathname: "/songs/[id]",
      params: { id, title },
    });
  };

  const onPressEditSong = (id: string) => {
    router.navigate({
      pathname: "/songs/[id]/edit",
      params: { id },
    });
  };

  const onPressDeleteSong = (id: string) => {
    verifyUserClick(
      "Delete Song",
      "Are you sure you want to permanently delete it?",
      async () => {
        await deleteSong(id);
        dispatch(deleteSongReducer(id));
      },
      () => {
        // let pl = Playlist.getById(idParam)!;
        // setSongs(pl.songs);
        console.log("deleteSong done!");
      }
    );
  };

  const onPressAddSongs = () => {
    router.navigate({
      pathname: "/playlists/[id]/addsongs",
      params: { id: playlistIdParam },
    });
  };

  const onPressEditPlaylist = () => {
    router.navigate({
      pathname: "/playlists/[id]/edit",
      params: { id: playlistIdParam },
    });
  };

  const onChangeSortBy = (value: SortBy) => {
    if (value === sortBy && value !== "CUSTOM") {
      setReverse(!reverse);
    } else {
      setSortBy(value);
      if (value === "CUSTOM") {
        setReverse(false);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, width: "100%", paddingTop: 20 }}>
      <FlashList
        data={songs}
        estimatedItemSize={songs.length || 1}
        extraData={colors}
        scrollIndicatorInsets={{ right: 1 }}
        ListHeaderComponent={() => {
          if (songs && songs.length > 0)
            return (
              <View style={{ backgroundColor: colors.background }}>
                <PrimaryButton
                  style={{ margin: 20 }}
                  onPress={onPressAddSongs}
                  title={t("add_songs").toUpperCase()}
                  outline
                />
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    paddingVertical: 18,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                    paddingLeft: 20,
                    alignItems: "center",
                  }}
                  onPress={() => setEnableSortSelect(true)}>
                  <Text style={{ color: colors.onBackground }}>
                    {sortOptions
                      .find(o => o.value === sortBy)
                      ?.label.toUpperCase()}
                  </Text>
                  <MaterialCommunityIcons
                    name={reverse ? "arrow-up" : "arrow-down"}
                    style={{ marginLeft: 8 }}
                    size={20}
                    color={colors.onBackground}
                  />
                </TouchableOpacity>
              </View>
            );
          else return null;
        }}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListEmptyComponent={
          <EmptyListMessage
            textStyle={{ color: colors.onBackground }}
            message={t("you_havent_added_any_song_to_this_playlist_yet")}
            onPress={onPressAddSongs}
            buttonTitle={t("add_songs").toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          if (!item?.id) return null;
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
              title={item.title}
              subtitle={item.artist.name}
              onPress={() => onSelectSong(item.id!, item.title)}
              options={[
                { title: t("edit"), onPress: () => onPressEditSong(item.id!) },
                {
                  title: t("delete"),
                  onPress: () => onPressDeleteSong(item.id!),
                },
              ]}
            />
          );
        }}
      />
      <PickerModal
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.surfaceDisabled,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        show={enableSortSelect}
        value={sortBy}
        options={sortOptions}
        onDismiss={() => setEnableSortSelect(false)}
        onChange={onChangeSortBy}
      />
    </View>
  );
};

export default PlaylistView;
