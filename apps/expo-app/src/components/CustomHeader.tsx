import { FunctionComponent, ReactNode } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  headerRight?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const CustomHeader: FunctionComponent<Props> = ({
  title,
  headerRight,
  containerStyle,
  titleStyle,
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.title, titleStyle]}>{title}</Text>
    <View style={styles.headerRight}>{headerRight}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: Platform.OS === "android" ? 16 : undefined,
  },
  title: {
    flex: 1,
    fontFamily: Platform.OS === "android" ? "sans-serif-medium" : undefined,
    fontWeight: Platform.OS === "android" ? "normal" : "600",
    fontSize: Platform.OS === "android" ? 20 : 17,
    textAlign: Platform.OS === "ios" ? "center" : undefined,
    paddingVertical: 14.5,
  },
  headerRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
  },
});
export default CustomHeader;
