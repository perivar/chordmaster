import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import Background from "@/components/Background";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import Paragraph from "@/components/Paragraph";

const Onboarding = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  const showDebugScreen = false;

  return (
    <Background>
      <Logo />
      <Header>Chord Master</Header>

      <Paragraph>Welcome and enjoy.</Paragraph>

      <View style={{ width: "100%" }}>
        <Button
          mode="contained"
          style={{
            borderRadius: 5,
          }}
          contentStyle={{
            width: "100%",
            height: 44,
          }}
          labelStyle={{ textAlign: "center", fontSize: 14 }}
          onPress={() => router.navigate("/login")}>
          Login
        </Button>
        <Button
          mode="outlined"
          style={{
            borderRadius: 5,
          }}
          contentStyle={{
            width: "100%",
            height: 44,
          }}
          labelStyle={{ textAlign: "center", fontSize: 14 }}
          onPress={() => router.navigate("/register")}>
          Sign Up
        </Button>
      </View>

      {showDebugScreen && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.surfaceDisabled }]}>
            App crashes on launch?
          </Text>
          <TouchableOpacity onPress={() => router.navigate("/debug")}>
            <Text
              style={[
                styles.link,
                { color: colors.surfaceDisabled, paddingLeft: 5 },
              ]}>
              show debug info
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Background>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {},
  link: {
    fontWeight: "bold",
  },
});

export default memo(Onboarding);
