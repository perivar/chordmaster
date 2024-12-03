import React from "react";
import { KeyboardAvoidingView, StyleProp, ViewStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type BackgroundProps = {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

const Background = ({ children, containerStyle }: BackgroundProps) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <KeyboardAvoidingView
      className="w-full flex-1 items-center justify-center self-center"
      style={[{ backgroundColor: colors.background }, containerStyle]}
      behavior="padding">
      {children}
    </KeyboardAvoidingView>
  );
};

export default Background;
