import { memo } from "react";
import { Image, StyleSheet } from "react-native";

const Logo = () => (
  <Image
    source={require("../../assets/adaptive-icon.png")}
    style={styles.image}
  />
);

const styles = StyleSheet.create({
  image: {
    width: 256,
    height: 256,
    alignSelf: "center",
  },
});

export default memo(Logo);
