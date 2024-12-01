import { useEffect, useState } from "react";
import { View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import { ActivityIndicator } from "react-native-paper";

import useFirestoreReduxMethods from "../hooks/useFirestoreReduxMethods";
import { useLocalization } from "../hooks/useLocalization";
import { useTheme } from "../hooks/useTheme";
import TabBarIcon from "../components/TabBarIcon";

import {
  MainTabParamList,
  RootStackParamList,
  SettingsStackParamList,
} from "../types/types";
import AddSongUsingUrl from "../screens/AddSongUsingUrl";
import ArtistList from "../screens/ArtistList";
import ArtistView from "../screens/ArtistView";
import HomeScreen from "../screens/Home/HomeScreen";
import OnlineArtistView from "../screens/OnlineArtistView";
import OnlineSearch from "../screens/OnlineSearch";
import PlaylistAddSongs from "../screens/PlaylistAddSongs";
import PlaylistEdit from "../screens/PlaylistEdit/PlaylistEdit";
import PlaylistList from "../screens/PlaylistList/PlaylistList";
import PlaylistView from "../screens/PlaylistView";
import FontSizeSelect from "../screens/Settings/FontSizeSelect";
import Settings from "../screens/Settings/Settings";
import SongEdit from "../screens/SongEdit";
import SongList from "../screens/SongList";
import SongPreview from "../screens/SongPreview";
import SongView from "../screens/SongView/SongView";

const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsTab = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShown: true,
      }}>
      <SettingsStack.Screen
        name="Settings"
        options={{ title: t("settings") }}
        component={Settings}
      />
      <SettingsStack.Screen
        name="FontSizeSelect"
        options={{ title: t("text_size") }}
        component={FontSizeSelect}
      />
    </SettingsStack.Navigator>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTab = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.onSurfaceDisabled,
        headerShown: false,
      }}>
      <Tab.Screen
        name="PlaylistList"
        options={{
          title: t("playlists"),
          tabBarIcon: props => <TabBarIcon {...props} name="playlist-music" />,
        }}
        component={PlaylistList}
      />
      <Tab.Screen
        name="ArtistList"
        options={{
          title: t("artists"),
          tabBarIcon: props => <TabBarIcon {...props} name="account-music" />,
        }}
        component={ArtistList}
      />
      <Tab.Screen
        name="SongList"
        options={{
          title: t("songs"),
          tabBarIcon: props => (
            <TabBarIcon {...props} name="music-box-multiple" />
          ),
        }}
        component={SongList}
      />
      <Tab.Screen
        name="OnlineSearch"
        options={{
          title: t("online_search"),
          tabBarIcon: props => <TabBarIcon {...props} name="cloud-search" />,
        }}
        component={OnlineSearch}
      />
      <Tab.Screen
        name="SettingsTab"
        options={{
          title: t("settings"),
          tabBarIcon: props => <TabBarIcon {...props} name="cog" />,
        }}
        component={SettingsTab}
      />
    </Tab.Navigator>
  );
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const { t } = useLocalization();
  const { theme } = useTheme();
  const { colors } = theme;

  const {
    loadAppConfigData,
    loadUserAppConfigData,
    loadUserSongData,
    loadUserPlaylistData,
  } = useFirestoreReduxMethods();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    try {
      await loadAppConfigData(Constants?.expoConfig?.extra?.appConfigDocId);
    } catch (error) {
      console.log("Loading app settings failed:", error);
    }

    try {
      await loadUserAppConfigData();
    } catch (error) {
      console.log("Loading user app settings failed:", error);
    }

    // instead of loading the artists, use the artists from the loaded songs instead
    // await loadArtistData();

    await loadUserSongData();
    await loadUserPlaylistData();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      initialRouteName="MainTab"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.onBackground,
        cardStyle: { backgroundColor: colors.background },
      }}>
      <RootStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: t("home") }}
      />
      <RootStack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false, title: t("home") }}
      />
      <RootStack.Screen
        name="OnlineArtistView"
        component={OnlineArtistView}
        options={({ route }) => ({ title: route.params.title })}
      />
      <RootStack.Screen
        name="SongPreview"
        component={SongPreview}
        options={{ title: t("preview") }}
      />
      <RootStack.Screen
        name="ArtistView"
        component={ArtistView}
        options={({ route }) => ({ title: route.params.title })}
      />
      <RootStack.Screen
        name="SongView"
        component={SongView}
        options={({ route }) => ({ title: route.params.title })}
      />
      <RootStack.Screen
        name="AddSongUsingUrl"
        component={AddSongUsingUrl}
        options={{ title: t("add_song_using_url"), headerBackTitle: "Songs" }}
      />
      <RootStack.Screen
        name="SongEdit"
        component={SongEdit}
        options={{ headerBackTitle: "Songs" }}
      />
      <RootStack.Screen
        name="PlaylistView"
        component={PlaylistView}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
      <RootStack.Screen
        name="PlaylistAddSongs"
        component={PlaylistAddSongs}
        options={{ title: t("add_songs") }}
      />
      <RootStack.Screen
        name="PlaylistEdit"
        component={PlaylistEdit}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
