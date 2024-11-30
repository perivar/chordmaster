import { Image, StyleSheet, View } from "react-native";

import { useTheme } from "../hooks/useTheme";

const SplashScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={{
          alignItems: "center",
        }}>
        <Image
          source={require("../../assets/adaptive-icon.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 256,
    height: 256,
    // marginBottom: 8,
  },
});
