import React, { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { TextInput as PaperTextInput } from "react-native-paper";

import { useTheme } from "@/hooks/useTheme";

type Props = React.ComponentProps<typeof PaperTextInput> & {
  errorText?: string;
  description?: string;
  isPassword?: boolean;
};

const TextInput = ({ errorText, description, isPassword, ...props }: Props) => {
  const { theme } = useTheme();

  const [passwordVisible, setPasswordVisible] = useState(true);

  return (
    <View style={styles.container}>
      <PaperTextInput
        style={{ backgroundColor: theme.colors.surface }}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        secureTextEntry={isPassword ? passwordVisible : false}
        right={
          isPassword && (
            <PaperTextInput.Icon
              icon={passwordVisible ? "eye" : "eye-off"}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          )
        }
        {...props}
      />
      {description && !errorText ? (
        <Text style={[styles.description, { color: theme.colors.secondary }]}>
          {description}
        </Text>
      ) : null}
      {errorText ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  description: {
    fontSize: 13,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    paddingTop: 8,
  },
});

export default memo(TextInput);
