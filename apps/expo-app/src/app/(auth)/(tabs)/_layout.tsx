import { Tabs } from "expo-router";

import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import TabBarIcon from "@/components/TabBarIcon";

export default function TabLayout() {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.onSurfaceDisabled,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="playlists"
        options={{
          title: t("playlists"),
          tabBarIcon: props => <TabBarIcon {...props} name="playlist-music" />,
        }}
      />
      <Tabs.Screen
        name="artists"
        options={{
          title: t("artists"),
          tabBarIcon: props => <TabBarIcon {...props} name="account-music" />,
        }}
      />
      <Tabs.Screen
        name="songs"
        options={{
          title: t("songs"),
          tabBarIcon: props => (
            <TabBarIcon {...props} name="music-box-multiple" />
          ),
        }}
      />
      <Tabs.Screen
        name="onlinesearch"
        options={{
          title: t("online_search"),
          tabBarIcon: props => <TabBarIcon {...props} name="cloud-search" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: props => <TabBarIcon {...props} name="cog" />,
        }}
      />
    </Tabs>
  );
}
