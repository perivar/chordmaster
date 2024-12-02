import { useLocalSearchParams } from "expo-router";

import OnlineSongPreview from "@/screens/OnlineSearch/OnlineSongPreview";

export default function OnlineDetailScreen() {
  const { path } = useLocalSearchParams<{ path: string }>();

  return <OnlineSongPreview path={path} />;
}
