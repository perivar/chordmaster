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
          title: t("songs"),
          headerShown: false,
        }}
      />
      <Stack.Screen name="create" options={{ title: t("add_song") }} />
      <Stack.Screen
        name="addurl"
        options={{ title: t("add_song_using_url") }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: "",
        }}
      />
      <Stack.Screen name="[id]/edit" options={{}} />
      <Stack.Screen name="[id]/delete" options={{}} />
    </Stack>
  );
};

export default StackLayout;
