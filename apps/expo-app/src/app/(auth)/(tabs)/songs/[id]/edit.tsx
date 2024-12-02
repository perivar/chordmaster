import { useLocalSearchParams } from "expo-router";

import SongEdit from "@/screens/Songs/SongEdit";

export default function SongEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SongEdit id={id} />;
}
