import { Alert, Platform } from "react-native";

export const verifyUserClick = (
  title: string,
  description: string,
  onYesPress: () => void,
  onYesCallback?: () => void,
  onNoPress?: () => void,
  yesLabel?: string,
  noLabel?: string
) => {
  const alertFunc = () => {
    Alert.alert(
      title,
      description,
      [
        {
          text: yesLabel ?? "Yes",
          style: "destructive",
          onPress: async () => {
            await onYesPress();
            if (onYesCallback) onYesCallback();
          },
        },
        {
          text: noLabel ?? "No",
          style: "default",
          onPress: async () => {
            if (onNoPress) await onNoPress();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (Platform.OS === "ios") {
    setTimeout(alertFunc, 500);
  } else {
    alertFunc();
  }
};
