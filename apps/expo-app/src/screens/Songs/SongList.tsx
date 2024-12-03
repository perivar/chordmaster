import { FunctionComponent, useCallback, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import useFirestore, { ISong } from "@/hooks/useFirestore";
import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import CustomHeader from "@/components/CustomHeader";
import EmptyListMessage from "@/components/EmptyListMessage";
import ListItem from "@/components/ListItem";
import { Option } from "@/components/OptionsMenu";
import PageView from "@/components/PageView";
import SearchBar from "@/components/SearchBar";
import TouchableIcon from "@/components/TouchableIcon";
import { verifyUserClick } from "@/utils/verifyUserClick";

import { userSelector } from "@/redux/slices/auth";
import { deleteSongReducer, editSongReducer } from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const SongList: FunctionComponent = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const allSongs = useAppSelector(state => state.library.songs);

  const [songs, setSongs] = useState<ISong[]>(allSongs);
  const [query, setQuery] = useState("");

  const { deleteSong, setSongPreferences } = useFirestore();
  const { isLoading, loadSongData } = useFirestoreReduxMethods();

  const hasPublishAccess = user?.roles?.includes("Publisher") ? true : false;

  useFocusEffect(
    useCallback(() => {
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
    }, [query, allSongs])
  );

  const onSelectSong = (id: string, title: string) => {
    router.navigate({ pathname: "/songs/[id]", params: { id, title } });
  };

  const addNewSong = () => {
    router.navigate({ pathname: "/songs/create" });
  };

  const onTogglePublished = async (song: ISong) => {
    if (song && song.id) {
      await setSongPreferences(song.id, { published: !song.published });

      // update the song in redux with the preferences
      const newSong = { ...song };
      newSong.published = !song.published;
      dispatch(editSongReducer(newSong));
    }
  };

  const onPressEditSong = (id: string) => {
    router.navigate({ pathname: "/songs/[id]/edit", params: { id } });
  };

  const onPressGoToArtist = async (id: string) => {
    await loadSongData(id);

    const song = allSongs.find(s => s.id === id);
    if (song) {
      const artist = song.artist;

      router.navigate({
        pathname: "/artists/[id]",
        params: { id: artist.id!, title: artist.name },
      });
    } else {
      Alert.alert("Could not find song artist");
    }
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
        // have to filter the song here since the dispatch above is async and has not
        // been fully processed when we get here.
        setSongs(songs.filter(song => song.id !== id));
        console.log("deleteSong done!");
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PageView hasNoHeader>
      <CustomHeader
        containerStyle={{ backgroundColor: colors.background }}
        titleStyle={{ color: colors.onBackground }}
        title={t("songs")}
        headerRight={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <TouchableIcon
              onPress={() => {
                router.navigate({
                  pathname: "/songs/addurl",
                });
              }}
              name="cloud-search"
              color={colors.onBackground}
            />
            <TouchableIcon
              onPress={addNewSong}
              name="plus"
              color={colors.onBackground}
            />
          </View>
        }
      />
      <SearchBar
        onChangeText={value => setQuery(value)}
        query={query}
        placeholder={t("search")}
      />
      <FlashList
        data={songs}
        estimatedItemSize={songs.length || 1}
        extraData={{ colors, allSongs }}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListEmptyComponent={
          <EmptyListMessage
            textStyle={{ color: colors.onBackground }}
            message={t("you_havent_downloaded_any_song_yet")}
            onPress={() => {
              router.navigate({
                pathname: "/onlinesearch",
              });
            }}
            buttonTitle={t("go_to_online_search").toUpperCase()}
          />
        }
        renderItem={({ item }) => {
          const options: Option[] = [];

          options.push({
            title: t("go_to_artist"),
            onPress: () => onPressGoToArtist(item.id!),
          });

          if (hasPublishAccess) {
            options.push({
              title: item.published
                ? t("unpublish_from_community")
                : t("publish_to_community"),
              onPress: () => onTogglePublished(item),
            });
          }

          options.push({
            title: t("edit"),
            onPress: () => onPressEditSong(item.id!),
          });
          options.push({
            title: t("delete"),
            onPress: () => onPressDeleteSong(item.id!),
          });

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
              leftIcon={item.published ? "earth" : "empty-space"}
              onPress={() => onSelectSong(item.id!, item.title)}
              options={options}
            />
          );
        }}
      />
    </PageView>
  );
};

export default SongList;
