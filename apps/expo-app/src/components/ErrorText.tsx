import { FunctionComponent } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const ErrorText: FunctionComponent<TextProps> = props => {
  const { style, children } = props;
  if (children !== null) {
    return (
      <Text {...props} style={[styles.errorMsg, style]}>
        {children}
      </Text>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  errorMsg: { color: "red" },
});

export default ErrorText;
