import { useState } from "react";
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

const Register = () => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const { colors } = theme;

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { onEmailAndPasswordSignup, authError } = useFirebaseAuth();

  const isEnableSignUp = () => {
    return (
      displayName !== "" &&
      email !== "" &&
      password !== "" &&
      displayNameError === "" &&
      emailError === "" &&
      passwordError === ""
    );
  };

  return (
    <AuthLayout
      navigationLink={navigation.goBack}
      header={<Logo />}
      title={"Create Account"}
      error={authError}>
      {Constants.expoConfig?.extra?.usesEmailSignIn && (
        <View>
          <TextInput
            label="Name"
            returnKeyType="next"
            value={displayName}
            onChangeText={value => {
              validateUtils.validateName(value, setDisplayNameError);
              setDisplayName(value);
            }}
            error={!!displayNameError}
            errorText={displayNameError}
            autoComplete="off"
          />

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
            onPress={() =>
              onEmailAndPasswordSignup(displayName, email, password)
            }
            disabled={isEnableSignUp() ? false : true}>
            Sign Up
          </Button>
        </View>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={[styles.link, { color: colors.primary }]}>Login</Text>
        </TouchableOpacity>
      </View>

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
  label: {},
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
  },
});

export default Register;
