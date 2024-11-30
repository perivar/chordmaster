import { FunctionComponent } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

import PrimaryButton from "./PrimaryButton";

interface EmptyListMessageProps {
  message: string;
  onPress?: () => void;
  buttonTitle?: string;
  textStyle?: StyleProp<TextStyle>;
}
const EmptyListMessage: FunctionComponent<EmptyListMessageProps> = props => {
  const { message, onPress, buttonTitle, textStyle } = props;

  return (
    <View style={styles.container}>
      <Text style={[styles.message, textStyle]}>{message}</Text>
      {buttonTitle && onPress && (
        <PrimaryButton onPress={onPress} title={buttonTitle} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
});
export default EmptyListMessage;
