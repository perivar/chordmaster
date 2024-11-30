import { FunctionComponent } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import ErrorText from "./ErrorText";

interface LoadingIndicatorProps {
  style?: StyleProp<ViewStyle>;
  error?: string | null;
  loading?: boolean;
}
const LoadingIndicator: FunctionComponent<LoadingIndicatorProps> = props => {
  const { error, loading, style } = props;
  return (
    <View style={[styles.container, style]}>
      {error && <ErrorText style={styles.activity}>{error}</ErrorText>}
      {loading && <ActivityIndicator size={"small"} style={styles.activity} />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  activity: {
    paddingVertical: 20,
  },
});
export default LoadingIndicator;
