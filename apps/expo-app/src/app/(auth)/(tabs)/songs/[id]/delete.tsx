import { Text, View } from "react-native";

import { Link, useLocalSearchParams } from "expo-router";

export default function SongDeleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Song Delete: {id}</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
