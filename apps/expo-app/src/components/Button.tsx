import React from "react";
import { StyleSheet } from "react-native";

import { Button as PaperButton } from "react-native-paper";

type Props = React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, children, ...props }: Props) => {
  return (
    <PaperButton
      style={[styles.button, style]}
      labelStyle={[styles.text]}
      mode={mode}
      {...props}>
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});

export default Button;
