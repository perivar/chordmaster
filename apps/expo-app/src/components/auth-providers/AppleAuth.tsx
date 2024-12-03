import { useEffect, useState } from "react";
import { Platform } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { debug } from "@/utils/debug";

import Button from "../Button";

export default function AppleAuth() {
  const { onAppleLogin } = useFirebaseAuth();
  const [appleAuthAvailable, setAppleAuthAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkAppleLoginAvailability = async () => {
      try {
        const available = await AppleAuthentication.isAvailableAsync();
        debug("Checked whether Apple authentication is available:", available);

        setAppleAuthAvailable(available);
      } catch (err) {
        debug("AppleAuthentication.isAvailableAsync error:", err);
        setAppleAuthAvailable(false);
      }
    };

    if (Platform.OS === "ios" && !appleAuthAvailable) {
      checkAppleLoginAvailability();
    }
  }, []);

  // if we cannot use apple authentication, return nothing
  if (!appleAuthAvailable) return null;

  return (
    <Button
      icon={"apple"}
      mode="outlined"
      uppercase={false}
      style={{
        borderRadius: 5,
      }}
      labelStyle={{ textAlign: "center", fontSize: 14 }}
      onPress={onAppleLogin}>
      Continue with Apple
    </Button>
  );
}
