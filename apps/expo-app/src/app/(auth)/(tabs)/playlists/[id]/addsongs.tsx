import { useLocalSearchParams } from "expo-router";

import PlaylistAddSongs from "@/screens/Playlists/PlaylistAddSongs";

export default function PlaylistAddSongsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaylistAddSongs id={id} />;
}
