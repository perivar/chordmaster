import { FunctionComponent, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import OptionsMenu, { Option } from "./OptionsMenu";
import TouchableIcon from "./TouchableIcon";

export type LeftIconOptions =
  | null
  | "empty-space"
  | "arrow-up"
  | "arrow-down"
  | "earth";

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  leftIcon?: LeftIconOptions;
  showIcon?: undefined | null | "plus" | "check";
  options?: Option[];
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  optionMenuStyle?: StyleProp<ViewStyle>;
}

const ListItem: FunctionComponent<ListItemProps> = props => {
  const [isMenuEnabled, setMenuEnabled] = useState(false);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.item, props.containerStyle]}>
      {props.leftIcon === "empty-space" && (
        <View style={styles.leftIcon}></View>
      )}
      {props.leftIcon !== null && props.leftIcon !== "empty-space" && (
        <MaterialCommunityIcons
          style={styles.leftIcon}
          name={props.leftIcon}
          size={14}
          color={props.iconColor}
        />
      )}
      <View style={[styles.textContainer, props.textContainerStyle]}>
        <Text style={[styles.title, props.textStyle]}>{props.title}</Text>
        {props.subtitle && (
          <Text style={[styles.subtitle, props.textStyle]}>
            {props.subtitle}
          </Text>
        )}
      </View>
      {props.showIcon === "check" && (
        <TouchableIcon
          onPress={props.onPress}
          name="check"
          size={25}
          color={props.iconColor}
        />
      )}
      {props.showIcon === "plus" && (
        <TouchableIcon
          onPress={props.onPress}
          name="plus"
          size={25}
          color={props.iconColor}
        />
      )}
      {props.options && (
        <TouchableIcon
          onPress={() => setMenuEnabled(true)}
          name="dots-vertical"
          size={25}
          color={props.iconColor}
        />
      )}
      {props.options && (
        <OptionsMenu
          containerStyle={props.containerStyle}
          textStyle={props.textStyle}
          optionMenuStyle={props.optionMenuStyle}
          onDismiss={() => setMenuEnabled(false)}
          enabled={isMenuEnabled}
          options={props.options}
        />
      )}
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
  },
  leftIcon: {
    width: 30,
  },
});
