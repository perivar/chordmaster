import { useCallback, useEffect } from "react";

import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { AuthError, FacebookAuthProvider } from "firebase/auth";

import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { useTheme } from "../../hooks/useTheme";
import { debug } from "../../utils/debug";
import Button from "../Button";

WebBrowser.maybeCompleteAuthSession();

export default function FacebookAuth() {
  const { dark } = useTheme();

  const { firebaseLoginWithCredentials, setAuthError } = useFirebaseAuth();

  const [_, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: Constants?.expoConfig?.extra?.expoFacebookClientId,
  });

  // useEffect(() => {
  //   debug(
  //     'FacebookAuth - useAuthRequest facebook request:',
  //     facebookRequest
  //   );
  // }, [facebookRequest]);

  // useEffect(() => {
  //   if (facebookResponse) {
  //     debug(
  //       'FacebookAuth - useAuthRequest facebook response:',
  //       facebookResponse
  //     );
  //   }
  // }, [facebookResponse]);

  const onFacebookLogin = useCallback(() => {
    facebookPromptAsync();
  }, [facebookPromptAsync]);

  useEffect(() => {
    if (facebookResponse?.type === "success") {
      const { access_token } = facebookResponse.params;
      debug("FacebookAuth - facebookResponse - access_token:", access_token);
      const credential = FacebookAuthProvider.credential(access_token);
      firebaseLoginWithCredentials(credential);
    } else if (facebookResponse?.type === "error") {
      debug("facebook response error:", facebookResponse.error);
      setAuthError({
        code: facebookResponse?.error?.code,
        name: facebookResponse?.error?.name,
        message: facebookResponse?.error?.message,
        customData: {},
      } as AuthError);
    }
  }, [facebookResponse, firebaseLoginWithCredentials]);

  return (
    <Button
      icon={"facebook"}
      mode="contained"
      uppercase={false}
      style={{
        borderRadius: 5,
        backgroundColor: dark ? "white" : "black",
      }}
      textColor={dark ? "black" : "white"}
      labelStyle={{ textAlign: "center", fontSize: 14 }}
      onPress={onFacebookLogin}>
      Continue with Facebook
    </Button>
  );
}
