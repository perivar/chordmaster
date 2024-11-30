import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../hooks/useTheme";

interface IPageView {
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  hasNoHeader?: boolean;
  hasNoFooter?: boolean;
}

const PageView = ({
  children,
  containerStyle,
  hasNoHeader,
  hasNoFooter,
}: IPageView) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const edges: Edge[] = ["left", "right"];
  if (hasNoHeader) {
    edges.push("top");
  }

  if (hasNoFooter) {
    edges.push("bottom");
  }

  // const testChildren = (
  //   <View
  //     style={{
  //       flex: 1,
  //       justifyContent: 'space-between',
  //       alignItems: 'center',
  //     }}>
  //     <Text>This is top text.</Text>
  //     <Text>This is bottom text.</Text>
  //   </View>
  // );

  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          flex: 1,
          width: "100%",
          backgroundColor: colors.background,
        },
        containerStyle,
      ]}>
      {/* {testChildren} */}
      {children}
    </SafeAreaView>
  );
};

export default PageView;
