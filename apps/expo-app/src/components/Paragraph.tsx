import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => {
  const { theme } = useTheme();

  return (
    <Text style={[styles.text, { color: theme.colors.secondary }]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 12,
  },
});

export default memo(Paragraph);
