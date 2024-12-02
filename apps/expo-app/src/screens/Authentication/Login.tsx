import { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      navigationLink={navigation.goBack}
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

          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => router.navigate("/forgotten")}>
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            style={{
              borderRadius: 5,
            }}
            contentStyle={{
              width: "100%",
              height: 44,
            }}
            labelStyle={{ textAlign: "center", fontSize: 14 }}
            onPress={() => onEmailAndPasswordLogin(email, password)}
            disabled={isEnableSignIn() ? false : true}>
            Login
          </Button>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text style={[styles.link, { color: colors.primary }]}>
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

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {},
  link: {
    fontWeight: "bold",
  },
});

export default memo(Login);
