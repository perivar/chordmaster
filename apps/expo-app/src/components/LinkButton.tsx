import { Text, TouchableOpacity } from "react-native";

import * as Linking from "expo-linking";

import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";

import { FONTS } from "@/constants/theme";

type LinkButtonProps = {
  title?: string;
  url?: string;
};

const LinkButton = ({ title, url }: LinkButtonProps) => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const onPressSource = () => {
    if (!url) return;

    Linking.openURL(url);
  };

  if (!title || !url) return null;

  return (
    <TouchableOpacity
      onPress={onPressSource}
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{
          ...FONTS.body5,
          color: colors.onBackground,
        }}>
        {t("source")}
        {": "}
      </Text>
      <Text
        style={{
          ...FONTS.body5,
          color: colors.tertiary,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default LinkButton;
