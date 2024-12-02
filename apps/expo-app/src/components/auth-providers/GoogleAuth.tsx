import { useCallback, useEffect } from "react";

import { ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { AuthError, GoogleAuthProvider } from "firebase/auth";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useTheme } from "@/hooks/useTheme";
import { debug } from "@/utils/debug";

import Button from "../Button";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  const { dark } = useTheme();

  const { firebaseLoginWithCredentials, setAuthError } = useFirebaseAuth();

  const [_, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    responseType: ResponseType.IdToken,
    clientId: Constants.expoConfig?.extra?.expoGoogleClientId,
    iosClientId: Constants.expoConfig?.extra?.iosGoogleClientId,
    androidClientId: Constants.expoConfig?.extra?.androidGoogleClientId,
  });

  // useEffect(() => {
  //   debug(
  //     'GoogleAuth - useIdTokenAuthRequest google request:',
  //     googleRequest
  //   );
  // }, [googleRequest]);

  // useEffect(() => {
  //   if (googleResponse) {
  //     debug(
  //       'GoogleAuth - useIdTokenAuthRequest google response:',
  //       googleResponse
  //     );
  //   }
  // }, [googleResponse]);

  const onGoogleLogin = useCallback(() => {
    googlePromptAsync();
  }, [googlePromptAsync]);

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      debug("GoogleAuth - googleResponse - id_token:", id_token);
      const credential = GoogleAuthProvider.credential(id_token);
      firebaseLoginWithCredentials(credential);
    } else if (googleResponse?.type === "error") {
      debug("google response error:", googleResponse.error);
      setAuthError({
        code: googleResponse?.error?.code,
        name: googleResponse?.error?.name,
        message: googleResponse?.error?.message,
        customData: {},
      } as AuthError);
    }
  }, [googleResponse, firebaseLoginWithCredentials]);

  return (
    <Button
      icon={"google"}
      mode="contained"
      uppercase={false}
      style={{
        borderRadius: 5,
        backgroundColor: dark ? "white" : "black",
      }}
      textColor={dark ? "black" : "white"}
      labelStyle={{ textAlign: "center", fontSize: 14 }}
      onPress={onGoogleLogin}>
      Continue with Google
    </Button>
  );
}
