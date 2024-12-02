import { useLocalSearchParams } from "expo-router";

import ArtistView from "@/screens/Artists/ArtistView";

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ArtistView id={id} />;
}
