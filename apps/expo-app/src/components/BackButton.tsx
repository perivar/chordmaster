import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import { getStatusBarHeight } from "react-native-status-bar-height";

import { useTheme } from "../hooks/useTheme";

type BackButtonProps = {
  goBack?: () => void;
};

const BackButton = ({ goBack }: BackButtonProps) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        style={[styles.image, { tintColor: dark ? "white" : "black" }]}
        source={require("../assets/arrow_back.png")}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 0,
    zIndex: 1, // make sure it is clickable even when other elements are overlapping
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
