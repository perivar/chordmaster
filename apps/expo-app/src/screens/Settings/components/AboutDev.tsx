import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Application from "expo-application";
import Constants from "expo-constants";

import { FONTS, SIZES } from "../../../constants/theme";
import { useLocalization } from "../../../hooks/useLocalization";
import { useTheme } from "../../../hooks/useTheme";

const AboutDev = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const goToDevURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}>
      <View style={styles.container}>
        <Text style={[{ color: colors.primary, ...FONTS.body5 }]}>
          {t("developed_by")}{" "}
        </Text>
        <TouchableOpacity
          onPress={() => goToDevURL("https://github.com/artutra")}
          style={styles.devButton}>
          <Text style={[{ color: colors.secondary, ...FONTS.body4 }]}>
            Artur Miranda
          </Text>
        </TouchableOpacity>
        <Text style={[{ color: colors.primary, ...FONTS.body5 }]}> and </Text>
        <TouchableOpacity
          onPress={() => goToDevURL("https://github.com/perivar")}
          style={styles.devButton}>
          <Text style={[{ color: colors.secondary, ...FONTS.body4 }]}>
            Per Ivar Nerseth
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text
          style={[
            {
              color: colors.primary,
              ...FONTS.body5,
              paddingRight: SIZES.min,
            },
          ]}>
          {t("version")}:
        </Text>
        <Text
          style={[
            {
              color: colors.secondary,
              ...FONTS.body4,
              paddingRight: SIZES.min,
            },
          ]}>
          {Constants.expoConfig?.version}
        </Text>
        <Text
          style={[
            { color: colors.primary, ...FONTS.body5, paddingRight: SIZES.min },
          ]}>
          {t("build")}:
        </Text>
        <Text
          style={[
            {
              color: colors.secondary,
              ...FONTS.body4,
              paddingRight: SIZES.min,
            },
          ]}>
          {Constants.expoConfig?.ios?.buildNumber}
        </Text>
      </View>
      <View style={styles.container}>
        <Text
          style={[
            {
              color: colors.primary,
              ...FONTS.body5,
              paddingRight: SIZES.min,
            },
          ]}>
          {t("native_version")}:
        </Text>
        <Text
          style={[
            {
              color: colors.secondary,
              ...FONTS.body4,
              paddingRight: SIZES.min,
            },
          ]}>
          {Application.nativeApplicationVersion}
        </Text>
        <Text
          style={[
            {
              color: colors.primary,
              ...FONTS.body5,
              paddingRight: SIZES.min,
            },
          ]}>
          {t("native_build")}:
        </Text>
        <Text
          style={[
            {
              color: colors.secondary,
              ...FONTS.body4,
              paddingRight: SIZES.min,
            },
          ]}>
          {Application.nativeBuildVersion}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  devButton: {
    paddingVertical: 0,
  },
});

export default AboutDev;
