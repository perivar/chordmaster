import { Text, View } from "react-native";

import { Link, useLocalSearchParams } from "expo-router";

export default function ArtistEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Artist Edit: {id}</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
