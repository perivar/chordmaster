import { Text, View } from "react-native";

import { Link } from "expo-router";

export default function SongCreateScreen() {
  return (
    <View>
      <Text>Song Create</Text>
      <Link href="../">Go back</Link>
    </View>
  );
}
