import { FunctionComponent } from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface Option {
  title: string;
  onPress: () => void;
}

interface OptionsMenuProps {
  enabled: boolean;
  options: Option[];
  onDismiss: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  optionMenuStyle?: StyleProp<ViewStyle>;
}

const OptionsMenu: FunctionComponent<OptionsMenuProps> = props => {
  const { enabled, onDismiss, options } = props;

  if (!enabled) return null;

  return (
    <Modal transparent onDismiss={onDismiss}>
      <View style={styles.backgroundOverlay}>
        <TouchableOpacity style={styles.outsideContainer} onPress={onDismiss} />
        <View style={[styles.container, props.containerStyle]}>
          {options.map(option => {
            return (
              <TouchableOpacity
                key={option.title}
                style={[styles.optionItem, props.optionMenuStyle]}
                onPress={() => {
                  onDismiss();
                  option.onPress();
                }}>
                <Text style={[styles.optionTitle, props.textStyle]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};
export default OptionsMenu;

const styles = StyleSheet.create({
  backgroundOverlay: {
    backgroundColor: "#00000090",
    flex: 1,
    justifyContent: "flex-end",
  },
  outsideContainer: {
    flex: 1,
    borderBottomWidth: 1,
  },
  container: {
    paddingBottom: 20,
  },
  optionItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  optionTitle: {
    paddingVertical: 20,
    fontSize: 18,
  },
});
