import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => {
  const { theme } = useTheme();

  return (
    <Text style={[styles.header, { color: theme.colors.primary }]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default memo(Header);
