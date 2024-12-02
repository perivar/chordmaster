import { Text, View } from "react-native";

import { Link, useLocalSearchParams } from "expo-router";

export default function PlaylistDeleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Playlist Delete: {id}</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
