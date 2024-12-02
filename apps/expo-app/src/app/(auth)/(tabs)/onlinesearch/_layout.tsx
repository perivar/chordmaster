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
          title: t("online_search"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[path]/index"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
};

export default StackLayout;
