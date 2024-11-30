import { FunctionComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { useTheme } from "../hooks/useTheme";

interface PrimaryButtonProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  onPress: () => void;
  outline?: boolean;
}

const PrimaryButton: FunctionComponent<PrimaryButtonProps> = props => {
  const { title, onPress, outline = false, style } = props;

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        outline ? styles.buttonOutline : styles.button,
        outline
          ? {
              borderColor: theme.colors.tertiary,
              backgroundColor: theme.colors.background,
            }
          : { backgroundColor: theme.colors.secondary },
        style,
      ]}
      onPress={onPress}>
      <Text
        style={[
          outline
            ? { color: theme.colors.onBackground }
            : { color: theme.colors.background },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonOutline: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default PrimaryButton;
