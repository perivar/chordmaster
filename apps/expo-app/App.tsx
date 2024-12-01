import "./src/firebase/config";

import { LogBox } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import LocalizationProvider from "./src/context/LocalizationProvider";
import ThemeProvider from "./src/context/ThemeProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import store from "./src/redux/store";

// Ignore the dev-client SplashScreen error
// 'SplashScreen.show' has already been called for given view controller.
LogBox.ignoreLogs(["'SplashScreen.show'"]);

export default function App() {
  // const isLoadingComplete = useCachedResources();
  const isLoadingComplete = true;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LocalizationProvider>
            <Provider store={store}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AppNavigator />
              </GestureHandlerRootView>
            </Provider>
          </LocalizationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
