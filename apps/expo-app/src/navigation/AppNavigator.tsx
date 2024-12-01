import { ColorSchemeName } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";

import useFirebaseAuth from "../hooks/useFirebaseAuth";
import useFirebaseUser from "../hooks/useFirebaseUser";
import usePushNotifications from "../hooks/usePushNotifications";
import { CombinedDarkTheme, CombinedDefaultTheme } from "../hooks/useTheme";
import { debug } from "../utils/debug";

import { ThemeType } from "../context/ThemeProvider";
import { userSelector } from "../redux/slices/auth";
import { useAppSelector } from "../redux/store/hooks";
import SplashScreen from "../screens/SplashScreen";
import OnboardingStackNavigator from "./OnboardingStackNavigator";
import RootStackNavigator from "./RootStackNavigator";

const RootNavigator = () => {
  const { authSetup } = useFirebaseAuth();

  useFirebaseUser();

  const { notification } = usePushNotifications(response =>
    debug("tap: ", response)
  );

  const user = useAppSelector(userSelector);

  if (!authSetup) {
    // We haven't finished checking for user yet
    return <SplashScreen />;
  }

  if (notification) {
    debug("notification: ", notification);
  }

  return <>{user ? <RootStackNavigator /> : <OnboardingStackNavigator />}</>;
};

const AppNavigator = ({ colorScheme }: { colorScheme?: ColorSchemeName }) => {
  const isDarkMode = colorScheme === ThemeType.DARK;
  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={combinedTheme}>
      <NavigationContainer theme={combinedTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
