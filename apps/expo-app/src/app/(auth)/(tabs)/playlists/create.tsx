import { Text, View } from "react-native";

import { Link } from "expo-router";

export default function PlaylistCreateScreen() {
  return (
    <View>
      <Text>Playlist Create</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
