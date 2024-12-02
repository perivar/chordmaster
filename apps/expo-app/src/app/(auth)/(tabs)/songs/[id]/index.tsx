import { useLocalSearchParams } from "expo-router";

import SongView from "@/screens/Songs/SongView";

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SongView id={id} />;
}
