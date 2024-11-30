import { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { validateUtils } from "@chordmaster/utils";

import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import TextInput from "../../components/TextInput";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { useTheme } from "../../hooks/useTheme";
import { OnboardingStackScreenProps } from "../../types/types";

const ForgotPasswordScreen = ({
  navigation,
}: OnboardingStackScreenProps<"ForgotPasswordScreen">) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const { onSendPasswordResetEmail, authError, authSuccess } =
    useFirebaseAuth();

  const isEnableSendEmail = () => {
    return email !== "" && emailError === "";
  };

  return (
    <AuthLayout
      navigationLink={navigation.goBack}
      header={<Logo />}
      footer={
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            ← Back to login
          </Text>
        </TouchableOpacity>
      }
      title={"Restore Password"}
      error={authError}
      success={authSuccess}>
      {!authSuccess ? (
        <View>
          <TextInput
            label="E-mail address"
            returnKeyType="done"
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
            description="You will receive email with password reset link."
          />

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
            onPress={() => onSendPasswordResetEmail(email)}
            disabled={isEnableSendEmail() ? false : true}>
            Send Reset Instructions
          </Button>
        </View>
      ) : (
        <></>
      )}
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  back: {
    width: "100%",
    marginTop: 12,
  },
  label: {
    width: "100%",
  },
});

export default memo(ForgotPasswordScreen);
