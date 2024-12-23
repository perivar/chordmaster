import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { validateUtils } from "@chordmaster/utils";
import Constants from "expo-constants";
import { router, useNavigation } from "expo-router";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useTheme } from "@/hooks/useTheme";
import AppleAuth from "@/components/auth-providers/AppleAuth";
import FacebookAuth from "@/components/auth-providers/FacebookAuth";
import GoogleAuth from "@/components/auth-providers/GoogleAuth";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";

import { SIZES } from "@/constants/theme";

// The Login and Register forms are taken from:
// https://github.com/venits/react-native-login-template
// and
// https://github.com/callstack/react-native-paper-login-template
const Login = () => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const { colors } = theme;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isEnableSignIn = () => {
    return (
      email !== "" &&
      password !== "" &&
      emailError === "" &&
      passwordError === ""
    );
  };

  const { onEmailAndPasswordLogin, authError } = useFirebaseAuth();

  return (
    <AuthLayout
      navigationLink={navigation.canGoBack() ? navigation.goBack : undefined}
      header={<Logo />}
      title={"Welcome back"}
      error={authError}>
      {Constants.expoConfig?.extra?.usesEmailSignIn && (
        <View>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email}
            onChangeText={value => {
              validateUtils.validateEmail(value, setEmailError);
              setEmail(value);
            }}
            error={!!emailError}
            errorText={emailError}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password}
            onChangeText={value => {
              validateUtils.validatePassword(value, setPasswordError);
              setPassword(value);
            }}
            error={!!passwordError}
            errorText={passwordError}
            isPassword
            autoComplete="off"
          />

          <View className="mb-6 w-full items-end">
            <TouchableOpacity onPress={() => router.navigate("/forgotten")}>
              <Text style={{ color: colors.primary }}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            mode="contained"
            style={{
              borderRadius: 5,
              backgroundColor: colors.secondaryContainer,
            }}
            contentStyle={{
              width: "100%",
              height: 44,
            }}
            labelStyle={{
              textAlign: "center",
              fontSize: 14,
              color: colors.onSecondaryContainer,
            }}
            onPress={() => onEmailAndPasswordLogin(email, password)}
            disabled={isEnableSignIn() ? false : true}>
            Login
          </Button>
          <View className="mt-1 flex-row">
            <Text className="font-bold" style={{ color: colors.secondary }}>
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text className="font-bold" style={{ color: colors.primary }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ paddingTop: SIZES.padding }} />

      {/* Apple */}
      {Constants.expoConfig?.extra?.usesAppleSignIn && <AppleAuth />}

      {/* Google */}
      {Constants.expoConfig?.extra?.usesGoogleSignIn && <GoogleAuth />}

      {/* Facebook */}
      {Constants.expoConfig?.extra?.usesFacebookSignIn && <FacebookAuth />}
    </AuthLayout>
  );
};

export default Login;
