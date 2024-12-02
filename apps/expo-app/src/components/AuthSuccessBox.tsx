import { Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";

interface AuthSuccessBoxProps {
  message: string;
}

export default function AuthSuccessBox({ message }: AuthSuccessBoxProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        marginVertical: 10,
        fontWeight: "bold",
        color: theme.colors.error,
      }}>
      {message}
    </Text>
  );
}
