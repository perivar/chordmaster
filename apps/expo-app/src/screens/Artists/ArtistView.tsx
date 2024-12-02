import { FC } from "react";

import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import useFirestore from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import ListItem from "@/components/ListItem";
import { verifyUserClick } from "@/utils/verifyUserClick";

import { deleteSongReducer } from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

type Props = {
  id: string;
};

const ArtistView: FC<Props> = props => {
  const { id: artistIdParam } = props;

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const allSongs = useAppSelector(state => state.library.songs);
  const songs = allSongs.filter(s => s.artist.id === artistIdParam);

  const { deleteSong } = useFirestore();

  const onSelectSong = (id: string, title: string) => {
    router.navigate({ pathname: "/songs/[id]", params: { id, title } });
  };

  const onPressEditSong = (id: string) => {
    router.navigate({ pathname: "/songs/[id]/edit", params: { id } });
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
        console.log("deleteSong done!");
      }
    );
  };

  return (
    <FlashList
      data={songs}
      estimatedItemSize={songs.length || 1}
      extraData={colors}
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
            title={item.title}
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
  );
};

export default ArtistView;
