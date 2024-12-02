import { Text, View } from "react-native";

import { Link, useLocalSearchParams } from "expo-router";

export default function ArtistDeleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Artist Delete: {id}</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
