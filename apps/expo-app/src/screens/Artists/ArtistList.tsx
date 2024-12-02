import { useCallback, useState } from "react";
import { View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { IArtist } from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import CustomHeader from "@/components/CustomHeader";
import EmptyListMessage from "@/components/EmptyListMessage";
import ListItem from "@/components/ListItem";
import PageView from "@/components/PageView";
import SearchBar from "@/components/SearchBar";

import { useAppSelector } from "@/redux/store/hooks";

const ArtistList = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  // const dispatch = useAppDispatch();
  const allArtists = useAppSelector(state => state.library.artists);

  const [artists, setArtists] = useState<IArtist[]>(allArtists);
  const [query, setQuery] = useState("");

  // Note! We have disabled the edit and delete methods
  // since we are using global artist tables in firestore
  // const [error, setError] = useState<string | null>(null);
  // const [showEditArtistModal, setShowEditArtistModal] = useState(false);
  // const [artistEditName, setArtistEditName] = useState<string>('');
  // const [artistEditId, setArtistEditId] = useState<string | null>(null);
  // const { editArtist, deleteArtist } = useFirestore();

  useFocusEffect(
    useCallback(() => {
      if (query !== "") {
        const filteredArtists = allArtists.filter(a =>
          a.name.toLowerCase().includes(query)
        );
        setArtists(filteredArtists);
      } else {
        // reset query
        setArtists(allArtists);
      }
    }, [query, allArtists])
  );

  const onSelectArtist = (id: string, name: string) => {
    router.navigate({ pathname: "/artists/[id]", params: { id, title: name } });
  };

  // const onPressDeleteArtist = (id: string, name: string) => {
  //   verifyUserClick(
  //     'Delete Artist',
  //     `Are you sure you want to permanently delete '${name}' ?`,
  //     async () => {
  //       await deleteArtist(id);
  //       dispatch(deleteArtistReducer(id));
  //     },
  //     () => {
  //       // setArtists(Artist.getAll());
  //       console.log('deleteArtist done!');
  //     }
  //   );
  // };

  // const onPressEditArtist = (id: string, name: string) => {
  //   setError(null);
  //   setArtistEditId(id);
  //   setArtistEditName(name);
  //   setShowEditArtistModal(true);
  // };

  // const onSubmitArtistName = async () => {
  //   try {
  //     if (artistEditName === '') {
  //       throw new Error(t('empty_name_not_allowed'));
  //     } else if (artistEditId) {
  //       let artist = await editArtist(artistEditId, artistEditName);

  //       console.log('onSubmitArtistName -> editArtist:', artist);

  //       await dispatch(addOrUpdateArtistReducer(artist));

  //       setShowEditArtistModal(false);
  //       // setArtists(Artist.getAll());
  //     }
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       setError(e.message);
  //     } else {
  //       throw e;
  //     }
  //   }
  // };

  return (
    <PageView hasNoHeader>
      <CustomHeader
        containerStyle={{ backgroundColor: colors.background }}
        titleStyle={{ color: colors.onBackground }}
        title={t("artists")}
      />
      {/* <TextInputModal
        error={error}
        value={artistEditName}
        onChange={value => setArtistEditName(value)}
        enabled={showEditArtistModal}
        onDismiss={() => {
          setError(null);
          setShowEditArtistModal(false);
        }}
        onSubmit={onSubmitArtistName}
      /> */}
      <SearchBar
        onChangeText={value => setQuery(value)}
        query={query}
        placeholder={t("search")}
      />
      <FlashList
        data={artists}
        estimatedItemSize={artists.length || 1}
        extraData={colors}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListEmptyComponent={
          <EmptyListMessage
            textStyle={{ color: colors.onBackground }}
            message={t("you_havent_downloaded_any_song_yet")}
            onPress={() => {
              router.navigate("/onlinesearch");
            }}
            buttonTitle={t("go_to_online_search").toUpperCase()}
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
              iconColor={colors.onBackground}
              // key={item.id!}
              title={item.name}
              onPress={() => onSelectArtist(item.id!, item.name)}
              // options={[
              //   {
              //     title: t('edit'),
              //     onPress: () => onPressEditArtist(item.id, item.name),
              //   },
              //   {
              //     title: t('delete'),
              //     onPress: () => onPressDeleteArtist(item.id!, item.name),
              //   },
              // ]}
            />
          );
        }}
      />
    </PageView>
  );
};

export default ArtistList;
