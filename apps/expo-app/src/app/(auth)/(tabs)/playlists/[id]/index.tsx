import { useLocalSearchParams } from "expo-router";

import PlaylistView from "@/screens/Playlists/PlaylistView";

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaylistView id={id} />;
}
