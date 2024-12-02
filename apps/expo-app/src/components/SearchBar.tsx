import React, { FunctionComponent } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";

interface SearchBarProps extends TextInputProps {
  query: string;
  inputRef?: React.RefObject<TextInput> | null | undefined;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder: string;
}

const SearchBar: FunctionComponent<SearchBarProps> = props => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.onBackground,
          },
        ]}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={colors.onBackground}
        />
        <TextInput
          ref={props.inputRef}
          style={[
            styles.searchText,
            {
              color: colors.onBackground,
            },
          ]}
          keyboardType="default"
          placeholderTextColor={colors.onBackground}
          // autoFocus={false}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={props.onSubmitEditing}
          value={props.query}
          clearButtonMode="always"
          {...props}
        />
      </View>
    </View>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  searchText: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 8,
    fontSize: 18,
  },
});
