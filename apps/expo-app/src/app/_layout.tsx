import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import useColorScheme from "@/hooks/useColorScheme";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  useTheme,
} from "@/hooks/useTheme";

import LocalizationProvider from "@/context/LocalizationProvider";
import ThemeProvider, { ThemeType } from "@/context/ThemeProvider";
import { userSelector } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useAppSelector } from "@/redux/store/hooks";
import SplashScreen from "@/screens/SplashScreen";

import "react-native-reanimated";
import "../../global.css";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import Constants from "expo-constants";

import useFirestoreReduxMethods from "@/hooks/useFirestoreReduxMethods";

export default function RootLayout() {
  // const isLoadingComplete = useCachedResources();
  const isLoadingComplete = true;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LocalizationProvider>
            <ReduxProvider store={store}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <InnerLayout />
              </GestureHandlerRootView>
            </ReduxProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}

// In order to avoid the Error: useTheme must be used within a ThemeProvider
function InnerLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === ThemeType.DARK;
  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={combinedTheme}>
      <AuthCheck />
    </PaperProvider>
  );
}

function AuthCheck() {
  const { authSetup } = useFirebaseAuth();

  useFirebaseUser();

  const user = useAppSelector(userSelector);

  if (!authSetup) {
    // We haven't finished checking for user yet
    return <SplashScreen />;
  }

  return <>{user ? <RootStack /> : <OnboardingStack />}</>;
}

function RootStack() {
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.onBackground,
      }}>
      <Stack.Screen name="(auth)/(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function OnboardingStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
    </Stack>
  );
}
