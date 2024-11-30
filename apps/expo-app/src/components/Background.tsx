import React, { memo } from "react";
import {
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

type BackgroundProps = {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

const Background = ({ children, containerStyle }: BackgroundProps) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, containerStyle]}
      behavior="padding">
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Background);
