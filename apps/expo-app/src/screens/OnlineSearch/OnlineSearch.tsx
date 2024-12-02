import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, TextInput, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import useFirestore, { ISong } from "@/hooks/useFirestore";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import CustomHeader from "@/components/CustomHeader";
import EmptyListMessage from "@/components/EmptyListMessage";
import ListItem from "@/components/ListItem";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageView from "@/components/PageView";
import SearchBar from "@/components/SearchBar";

import { userSelector } from "@/redux/slices/auth";
import { useAppSelector } from "@/redux/store/hooks";
import { SongDoc } from "@/types";

const OnlineSearch: FunctionComponent = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const user = useAppSelector(userSelector);

  const searchInput = useRef<TextInput>(null);
  const [docs, setDocs] = useState<SongDoc[] | null>(null);
  const [query, setQuery] = useState("");
  const [error] = useState<string | null>(null);

  const [allSongs, setAllSongs] = useState<ISong[]>();

  const { getSongsByUserId } = useFirestore();

  const [limitCount] = useState(20);
  const [invertOwner] = useState(true); // change the behavior to the exact opposite, only get songs that the userId does not own
  const [onlyPublished] = useState(true); // only include published songs

  const {
    isLoading,
    setIsLoading,
    setIsRefreshing,
    lastVisible,
    setLastVisible,
    InfiniteList,
  } = useInfiniteScroll<SongDoc>({
    initialNumToRender: 8,
    limitCount,
  });

  useEffect(() => {
    loadSongs();
  }, []);

  const getDocsFromSongs = useCallback((songs: ISong[]) => {
    const newDocs = songs.map(song => {
      const doc: SongDoc = {
        user: song.user?.displayName ?? "No user",
        path: song.id ?? "",
        artist: song.artist?.name ?? "No Artist",
        title: song.title,
        type: "song",
      };
      return doc;
    });
    return newDocs;
  }, []);

  const loadSongs = useCallback(async () => {
    if (!user || !user.uid) return;

    setIsLoading(true);
    console.log(`Loading ${limitCount} songs ...`);

    // Note! only run once
    // const queryConstraint = where('user.uid', '==', user.uid);
    // await bulkAddFieldToSongs('songs', 'published', false, queryConstraint);

    const data = await getSongsByUserId(
      user.uid,
      limitCount,
      undefined,
      invertOwner,
      onlyPublished
    );

    console.log(`Found ${data.songs.length} ...`);

    if (data.songs.length > 0) {
      setAllSongs(data.songs);

      const newDocs = getDocsFromSongs(data.songs);
      setDocs(newDocs);
    }

    setLastVisible(data.lastVisible);
    setIsLoading(false);
  }, []);

  const refreshSongs = useCallback(async () => {
    if (!user || !user.uid) return;

    if (lastVisible) {
      setIsRefreshing(true);
      console.log(
        `Refreshing ${limitCount} songs using last id: ${lastVisible.id} ...`
      );

      const data = await getSongsByUserId(
        user.uid,
        limitCount,
        lastVisible,
        invertOwner,
        onlyPublished
      );

      console.log(`Found ${data.songs.length} ...`);

      if (allSongs && docs && data.songs.length > 0) {
        // ensure we are adding to list, but don't bloat the memory
        setAllSongs(
          allSongs.length > 0 ? [...allSongs, ...data.songs] : data.songs
        );

        const newDocs = getDocsFromSongs(data.songs);
        setDocs(docs.length > 0 ? [...docs, ...newDocs] : newDocs);
      }

      setLastVisible(data.lastVisible);
      setIsRefreshing(false);
    }
  }, [lastVisible]);

  useFocusEffect(
    useCallback(() => {
      if (!allSongs) return;

      if (query !== "") {
        const filteredSongs = allSongs.filter(
          s =>
            s.title.toLowerCase().includes(query) ||
            s.artist.name.toLowerCase().includes(query)
        );

        const newDocs = getDocsFromSongs(filteredSongs);
        setDocs(newDocs);
      } else {
        // reset query
        const newDocs = getDocsFromSongs(allSongs);
        setDocs(newDocs);
      }
    }, [query, allSongs])
  );

  return (
    <PageView hasNoHeader>
      <CustomHeader
        containerStyle={{ backgroundColor: colors.background }}
        titleStyle={{ color: colors.onBackground }}
        title={t("online_search")}
      />
      <View style={{ paddingHorizontal: 15, paddingVertical: 4 }}>
        <Text style={{ color: colors.secondary }}>
          {t("search_for_community_songs")}
        </Text>
      </View>
      <SearchBar
        inputRef={searchInput}
        onChangeText={value => setQuery(value)}
        query={query}
        placeholder={t("search")}
      />
      <InfiniteList
        keyExtractor={item => item.path}
        data={docs}
        loadData={loadSongs}
        refreshData={refreshSongs}
        ListEmptyComponent={() => {
          return !isLoading ? (
            <EmptyListMessage
              textStyle={{ color: colors.onBackground }}
              message={t("artist_or_song_not_found")}
            />
          ) : null;
        }}
        ListHeaderComponent={
          <LoadingIndicator error={error} loading={isLoading} />
        }
        renderItem={({ item }) => {
          return (
            <ListItem
              containerStyle={{
                backgroundColor: colors.background,
                borderBottomColor: colors.surfaceDisabled,
              }}
              textStyle={{ color: colors.onBackground }}
              onPress={() => {
                router.navigate({
                  pathname: "/onlinesearch/[path]",
                  params: {
                    path: item.path,
                  },
                });
              }}
              title={item.title}
              subtitle={`${item.artist} (${item.user})`}
            />
          );
        }}
      />
    </PageView>
  );
};

export default OnlineSearch;
