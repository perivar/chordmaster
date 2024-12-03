import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import Constants from "expo-constants";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import useColorScheme from "@/hooks/useColorScheme";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { CombinedDarkTheme, CombinedDefaultTheme } from "@/hooks/useTheme";

import LocalizationProvider from "@/context/LocalizationProvider";
import ThemeProvider, { ThemeType } from "@/context/ThemeProvider";
import { userSelector } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useAppSelector } from "@/redux/store/hooks";
import SplashScreen from "@/screens/SplashScreen";

import "react-native-reanimated";
import "../../global.css";

export default function RootLayout() {
  // const isLoadingComplete = useCachedResources();
  const isLoadingComplete = true;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <LocalizationProvider>
              <ReduxProvider store={store}>
                <InnerLayout />
              </ReduxProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }
}

function InnerLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === ThemeType.DARK;
  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={combinedTheme}>
      <ProtectedLayout />
    </PaperProvider>
  );
}

function ProtectedLayout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // setup the different auth methods, like onAppleLogin and onEmailAndPasswordLogin
  const { authSetup } = useFirebaseAuth();

  // ensure the user is stored in redux whenever a new user is logged in
  useFirebaseUser();

  const user = useAppSelector(userSelector);

  const {
    loadAppConfigData,
    loadUserAppConfigData,
    loadUserSongData,
    loadUserPlaylistData,
  } = useFirestoreReduxMethods();

  useProtectedRoute(user, "/login", "/playlists");

  useEffect(() => {
    if (user) loadData();
  }, [user]);

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

  if (!authSetup) {
    // We haven't finished checking for user yet
    return <SplashScreen />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(auth)/(tabs)" />
      <Stack.Screen name="(public)" />
    </Stack>
  );
}
