import React, { FC } from "react";
import {
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useDimensions } from "@/utils/useDimensions";

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  onDismiss: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SideMenu: FC<Props> = ({
  isOpen,
  onDismiss,
  containerStyle,
  children,
}) => {
  const { isLandscape, windowData } = useDimensions();
  const insets = useSafeAreaInsets(); // Get safe area insets

  if (!isOpen) return null;

  const maxHeight = windowData.height;
  const heightStyle = isLandscape ? { height: maxHeight - 50 } : {};

  return (
    <Modal transparent onDismiss={onDismiss}>
      <TouchableOpacity style={styles.backgroundOverlay} onPress={onDismiss} />
      <SafeAreaView
        style={[styles.fixed, heightStyle, { top: 10 + insets.top }]}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[styles.card, containerStyle]}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    backgroundColor: "#00000020",
  },
  fixed: {
    position: "absolute",
    right: 10,
  },
  card: {
    display: "flex",
    borderRadius: 5,
    elevation: 2,
    backgroundColor: "white",
  },
});

export default SideMenu;
