import { FunctionComponent, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { TextInput as PaperTextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../hooks/useTheme";

import Button from "./Button";

interface TextInputModalProps {
  enabled: boolean;
  initialValue?: string;
  placeholder?: string;
  error?: string | null;
  submitButtonTitle?: string;
  value?: string;
  onChange?: (name: string) => void;
  onDismiss: () => void;
  onSubmit: (name: string) => void;
}

const TextInputModal: FunctionComponent<TextInputModalProps> = props => {
  const { theme } = useTheme();

  const {
    enabled,
    initialValue = "",
    placeholder,
    onDismiss,
    error,
    onSubmit,
    submitButtonTitle = "OK",
    onChange,
  } = props;

  const [value, setValue] = useState(initialValue);

  const onChangeText = (val: string) => {
    setValue(val);
    if (onChange) onChange(val);
  };

  if (!enabled) return null;

  return (
    <Modal transparent onDismiss={onDismiss}>
      <SafeAreaView style={styles.backgroundOverlay}>
        <TouchableOpacity style={styles.outsideContainer} onPress={onDismiss} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "height" : "padding"}>
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 40,
              paddingHorizontal: 20,
              backgroundColor: theme.colors.background,
            }}>
            <PaperTextInput
              mode="outlined"
              label={placeholder}
              onChangeText={onChangeText}
              value={props.value}
            />
            {error ? (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {error}
              </Text>
            ) : null}
            <Button
              mode="contained"
              style={{
                borderRadius: 5,
              }}
              labelStyle={{ textAlign: "center", fontSize: 16 }}
              onPress={() => onSubmit(value)}>
              {submitButtonTitle}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default TextInputModal;

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000080",
  },
  outsideContainer: {
    flex: 1,
  },
  error: {
    fontSize: 16,
    paddingTop: 8,
  },
});
