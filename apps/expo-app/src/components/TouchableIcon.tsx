import React, { FunctionComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface TouchableIconProps extends TouchableOpacityProps {
  iconStyle?: StyleProp<TextStyle>;
  size?: number;
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color?: string;
}

const TouchableIcon: FunctionComponent<TouchableIconProps> = props => {
  const { size = 30, name, color, iconStyle } = props;
  return (
    <TouchableOpacity {...props}>
      <MaterialCommunityIcons
        style={[styles.iconPadding, iconStyle]}
        name={name}
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconPadding: {
    padding: 10,
  },
});
export default TouchableIcon;
