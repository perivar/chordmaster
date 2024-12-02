import { FunctionComponent, memo } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

import Constants from "expo-constants";
import { useNavigation } from "expo-router";
import { Header } from "react-native/Libraries/NewAppScreen";

import { useTheme } from "@/hooks/useTheme";
import BackButton from "@/components/BackButton";
import Background from "@/components/Background";

interface ConstantItemProps {
  name: string;
  value: string;
  textStyle?: StyleProp<TextStyle>;
}

const ConstantItem: FunctionComponent<ConstantItemProps> = props => {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.text,
          props.textStyle,
          { color: theme.colors.secondary },
        ]}>
        {props.name}:
      </Text>
      <Text
        style={[
          styles.text,
          props.textStyle,
          { color: theme.colors.secondary },
        ]}>
        {props.value}
      </Text>
    </View>
  );
};

const DebugInfo = () => {
  const navigation = useNavigation();

  return (
    <Background
      containerStyle={{
        maxWidth: undefined,
      }}>
      <View style={{ paddingTop: 100 }} />
      <BackButton goBack={navigation.goBack} />

      <Header>Debug Info</Header>
      <ScrollView style={{ flex: 1 }}>
        <ConstantItem
          name="firebase.apiKey"
          value={Constants?.expoConfig?.extra?.firebase.apiKey}
        />
        <ConstantItem
          name="firebase.authDomain"
          value={Constants?.expoConfig?.extra?.firebase.authDomain}
        />
        <ConstantItem
          name="firebase.projectId"
          value={Constants?.expoConfig?.extra?.firebase.projectId}
        />
        <ConstantItem
          name="firebase.storageBucket"
          value={Constants?.expoConfig?.extra?.firebase.storageBucket}
        />
        <ConstantItem
          name="firebase.messagingSenderId"
          value={Constants?.expoConfig?.extra?.firebase.messagingSenderId}
        />
        <ConstantItem
          name="firebase.appId"
          value={Constants?.expoConfig?.extra?.firebase.appId}
        />
        <ConstantItem
          name="firebase.measurementId"
          value={Constants?.expoConfig?.extra?.firebase.measurementId}
        />
        <ConstantItem
          name="firebase.storageBaseUrl"
          value={Constants?.expoConfig?.extra?.firebase.storageBaseUrl}
        />
        <ConstantItem
          name="firebase.apiBaseUrl"
          value={Constants?.expoConfig?.extra?.firebase.apiBaseUrl}
        />

        <ConstantItem
          name="appConfigDocId"
          value={Constants?.expoConfig?.extra?.appConfigDocId}
        />

        <ConstantItem
          name="usesEmailSignIn"
          value={
            Constants?.expoConfig?.extra?.usesEmailSignIn ? "true" : "false"
          }
        />
        <ConstantItem
          name="usesAppleSignIn"
          value={
            Constants?.expoConfig?.extra?.usesAppleSignIn ? "true" : "false"
          }
        />
        <ConstantItem
          name="usesGoogleSignIn"
          value={
            Constants?.expoConfig?.extra?.usesGoogleSignIn ? "true" : "false"
          }
        />
        <ConstantItem
          name="usesFacebookSignIn"
          value={
            Constants?.expoConfig?.extra?.usesFacebookSignIn ? "true" : "false"
          }
        />

        <ConstantItem
          name="expoGoogleClientId"
          value={Constants?.expoConfig?.extra?.expoGoogleClientId}
        />
        <ConstantItem
          name="expoFacebookClientId"
          value={Constants?.expoConfig?.extra?.expoFacebookClientId}
        />
        <ConstantItem
          name="iosGoogleClientId"
          value={Constants?.expoConfig?.extra?.iosGoogleClientId}
        />
        <ConstantItem
          name="androidGoogleClientId"
          value={Constants?.expoConfig?.extra?.androidGoogleClientId}
        />

        <ConstantItem
          name="googleMapsCredentials"
          value={Constants?.expoConfig?.extra?.googleMapsCredentials}
        />

        <ConstantItem
          name="eas.projectId"
          value={Constants?.expoConfig?.extra?.eas.projectId}
        />
        <View style={{ paddingBottom: 100 }} />
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginVertical: 5,
  },
});

export default memo(DebugInfo);
