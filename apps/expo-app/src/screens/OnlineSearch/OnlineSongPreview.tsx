import { FunctionComponent, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import useFirestore, { ISong } from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import LinkButton from "@/components/LinkButton";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageView from "@/components/PageView";
import SongRender from "@/components/SongRender";
import SongTransformer from "@/components/SongTransformer";

import { userSelector } from "@/redux/slices/auth";
import {
  addOrUpdateArtistReducer,
  addOrUpdateSongReducer,
} from "@/redux/slices/library";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

type Props = { path: string };

const OnlineSongPreview: FunctionComponent<Props> = props => {
  const { path: songIdParam } = props;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);

  const [song, setSong] = useState<ISong | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const { addNewSong, getSongById } = useFirestore();

  useEffect(() => {
    loadSongData(songIdParam);
  }, [songIdParam]);

  const loadSongData = async (songId: string) => {
    try {
      setIsLoading(true);
      if (songId) {
        const songFound = await getSongById(songId);
        setSong(songFound);
      }
      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        setIsLoading(false);
      } else {
        throw e;
      }
    }
  };

  const saveSong = async () => {
    if (isSaving) return;

    setIsSaving(true);

    let newSong: ISong;
    try {
      if (song && user && user.uid) {
        newSong = await addNewSong(
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          {
            id: song.artist.id,
            name: song.artist.name,
          },
          song.title,
          song.content,

          song.external.id,
          song.external.url,
          song.external.source
        );

        console.log("SongPreview -> addNewSong:", newSong);

        await dispatch(addOrUpdateSongReducer(newSong));
        await dispatch(addOrUpdateArtistReducer(newSong.artist));

        router.replace({
          pathname: "/songs/[id]",
          params: { id: newSong.id!, title: newSong.title },
        });

        Alert.alert(t("info"), t("song_downloaded"));
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
    <View
      style={{ flex: 1, width: "100%", backgroundColor: colors.background }}>
      <LoadingIndicator error={error} loading={isLoading} />
      {song !== null && (
        <PageView hasNoFooter>
          <SongTransformer transposeDelta={0} chordProSong={song.content}>
            {({ htmlSong }) => (
              <View style={{ flex: 1 }}>
                <SongRender chordProContent={htmlSong} />
                <TouchableOpacity style={styles.fabButton} onPress={saveSong}>
                  <MaterialCommunityIcons
                    color="white"
                    size={30}
                    name="download"
                  />
                </TouchableOpacity>
                <LinkButton
                  title={song?.external?.source}
                  url={song?.external?.url}
                />
              </View>
            )}
          </SongTransformer>
        </PageView>
      )}
    </View>
  );
};

export default OnlineSongPreview;

const styles = StyleSheet.create({
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 100,
    backgroundColor: "tomato",
    padding: 15,
    margin: 10,
  },
});
