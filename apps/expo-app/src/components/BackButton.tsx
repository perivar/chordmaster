import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";

type BackButtonProps = {
  goBack?: () => void;
};

const BackButton = ({ goBack }: BackButtonProps) => {
  const { dark } = useTheme();
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <TouchableOpacity
      onPress={goBack}
      style={[styles.container, { top: 10 + insets.top }]} // Dynamic top value
    >
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
    left: 20,
    zIndex: 1, // make sure it is clickable even when other elements are overlapping
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
