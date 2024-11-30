import { useEffect, useState } from "react";

import { AuthError } from "firebase/auth";

const useFirebaseFriendlyError = (error: AuthError) => {
  const [friendlyError, setFriendlyError] = useState("");

  useEffect(() => {
    if (!error) return;
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/wrong-password"
    ) {
      setFriendlyError("Your email or password was incorrect");
    } else if (error.code === "auth/email-already-in-use") {
      setFriendlyError("An account with this email already exists");
    } else if (error.code === "auth/user-disabled") {
      setFriendlyError("User is disabled!");
    } else if (error.code === "auth/user-not-found") {
      setFriendlyError("User cannot be found!");
    } else if (error.code === "auth/weak-password") {
      setFriendlyError("Please choose a stronger password!");
    } else if (error.code === "auth/operation-not-allowed") {
      setFriendlyError("The sign-in provider cannot be used");
    } else {
      setFriendlyError("There was a problem with your request");
    }
  }, [error]);

  return friendlyError;
};

export default useFirebaseFriendlyError;
