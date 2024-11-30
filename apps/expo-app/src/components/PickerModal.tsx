import {
  Modal,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import ListItem, { LeftIconOptions } from "./ListItem";

export interface PickerOption<T> {
  key?: string;
  label: string;
  description?: string;
  leftIcon?: LeftIconOptions;
  value: T;
}

interface Props<T> {
  show: boolean;
  value: T;
  options: PickerOption<T>[];
  onChange: (name: T) => void;
  onDismiss: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
}

function PickerModal<T>(props: Props<T>) {
  const { value, show, onDismiss, options, onChange } = props;

  if (!show) return null;

  return (
    <Modal transparent onDismiss={onDismiss}>
      <View style={styles.backgroundOverlay}>
        <TouchableOpacity style={styles.outsideContainer} onPress={onDismiss} />
        <View style={[styles.container, props.containerStyle]}>
          {options.map(o => {
            return (
              <ListItem
                containerStyle={props.containerStyle}
                textStyle={props.textStyle}
                iconColor={props.iconColor}
                key={o.key}
                onPress={() => onChange(o.value)}
                title={o.label}
                leftIcon={o.leftIcon}
                subtitle={o.description}
                showIcon={o.value === value ? "check" : null}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
export default PickerModal;

const styles = StyleSheet.create({
  backgroundOverlay: {
    backgroundColor: "#00000090",
    flex: 1,
    justifyContent: "flex-end",
  },
  outsideContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
});
