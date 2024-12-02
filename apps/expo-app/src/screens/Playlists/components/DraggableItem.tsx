import { FunctionComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import TouchableIcon from "@/components/TouchableIcon";

interface DraggableItemProps {
  title: string;
  subtitle?: string;
  onPressDelete: () => void;
  onDragEnd: () => void;
  onDragStart: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = props => {
  const {
    title,
    subtitle,
    onDragStart,
    onDragEnd,
    onPressDelete,
    containerStyle,
    textStyle,
    iconColor,
  } = props;
  return (
    <View style={[styles.item, containerStyle]}>
      <TouchableIcon
        style={styles.deleteIcon}
        size={20}
        onPress={onPressDelete}
        name="minus-circle-outline"
        color={iconColor}
      />
      <View style={styles.labelAndDragContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, textStyle]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, textStyle]}>{subtitle}</Text>
          )}
        </View>
        <TouchableIcon
          activeOpacity={1}
          onPressIn={onDragStart}
          onPressOut={onDragEnd}
          name="drag"
          color={iconColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    justifyContent: "flex-start",
    paddingVertical: 5,
  },
  deleteIcon: {
    flex: 0,
  },
  textContainer: {
    flex: 1,
  },
  labelAndDragContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
  },
});
export default DraggableItem;
