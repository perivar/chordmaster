import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

import { Subscription } from "expo-apple-authentication";
import * as Device from "expo-device";
import { openSettings } from "expo-linking";
import * as Notifications from "expo-notifications";

import { debug } from "../utils/debug";

import useFirestore from "./useFirestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Error",
        "Sorry, we need your permission to enable Push Notifications. Please enable it in your privacy settings.",
        [
          {
            text: "OK",
          },
          {
            text: "Open Settings",
            onPress: async () => openSettings(),
          },
        ]
      );
      return undefined;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    debug("Expo push token received: ", token);
  } else {
    // Alert.alert(
    //   'Error',
    //   'Sorry, Push Notifications are only supported on physical devices.'
    // );
    debug("Push Notifications are only supported on physical devices.");
  }

  return token;
};

// https://dev.to/haydenbleasel/implementing-push-notifications-with-expo-and-firebase-cloud-functions-4knn
// https://negativeepsilon.com/en/posts/expo-notifications/
// Push notifications tool: https://expo.dev/notifications
const usePushNotifications = (
  onTapNotification?: (response: Notifications.NotificationResponse) => void
): {
  notification: Notifications.Notification | undefined;
} => {
  const { addTokenToUser } = useFirestore();

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    // Register for push notification
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(n => {
        setNotification(n);
      });

    // This listener is fired whenever a user taps on or interacts with a notification
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response =>
        onTapNotification?.(response)
      );

    return () => {
      if (notificationListener && notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener && responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (expoPushToken) {
        // originally this tries to add the token to a user before the user is logged in to firebase
        // i.e. the current.uid doesn't yet exist
        // therefore we use a separate useEffect method
        await addTokenToUser(expoPushToken);
      }
    })();
  }, [expoPushToken]);

  return { notification };
};

export default usePushNotifications;
