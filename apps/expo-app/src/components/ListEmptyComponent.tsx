import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

import { useTheme } from "../hooks/useTheme";

import { FONTS } from "../constants/theme";

export interface IListEmptyComponent {
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ListEmptyComponent = ({
  emptyMessage = "Nothing found ...",
  containerStyle,
  textStyle,
}: IListEmptyComponent) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        },
        containerStyle,
      ]}>
      <Text style={[{ ...FONTS.body3, color: colors.onBackground }, textStyle]}>
        {emptyMessage}
      </Text>
    </View>
  );
};

export default ListEmptyComponent;
