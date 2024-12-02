import { Stack } from "expo-router";

import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";

const StackLayout = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.onBackground,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: t("settings"),
        }}
      />
      <Stack.Screen name="fontsizeselect" options={{ title: t("text_size") }} />
    </Stack>
  );
};

export default StackLayout;
