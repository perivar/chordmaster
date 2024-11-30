import { createStackNavigator } from "@react-navigation/stack";

import { OnboardingStackParamList } from "../types/types";
import DebugInfoScreen from "../screens/Authentication/DebugInfoScreen";
import ForgotPasswordScreen from "../screens/Authentication/ForgotPasswordScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import OnboardingScreen from "../screens/Authentication/OnboardingScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="DebugInfoScreen" component={DebugInfoScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStackNavigator;
