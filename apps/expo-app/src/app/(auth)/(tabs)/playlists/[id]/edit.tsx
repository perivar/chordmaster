import { useLocalSearchParams } from "expo-router";

import PlaylistEdit from "@/screens/Playlists/PlaylistEdit";

export default function PlaylistEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaylistEdit id={id} />;
}
