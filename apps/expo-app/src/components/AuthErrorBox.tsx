import { AuthError } from "firebase/auth";

import useFirebaseFriendlyError from "@/hooks/useFirebaseFriendlyError";
import { useTheme } from "@/hooks/useTheme";

import ErrorText from "./ErrorText";

interface AuthErrorBoxProps {
  error: AuthError;
}

export default function AuthErrorBox({ error }: AuthErrorBoxProps) {
  const { theme } = useTheme();
  const displayError = useFirebaseFriendlyError(error);

  return (
    <ErrorText
      style={{
        marginVertical: 10,
        fontWeight: "bold",
        color: theme.colors.error,
      }}>
      {displayError}
    </ErrorText>
  );
}
