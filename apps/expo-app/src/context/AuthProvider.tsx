import { createContext, ReactNode, useContext, useEffect } from "react";

import { router, useSegments } from "expo-router";

import { IAuthUser, userSelector } from "@/redux/slices/auth";
import { useAppSelector } from "@/redux/store/hooks";

type AuthContextType = {
  user: IAuthUser | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function useProtectedRoute(user: IAuthUser | undefined) {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && inAuthGroup) {
      // Redirect unauthenticated users to the login page
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      // Redirect authenticated users to the app's main authenticated screen
      router.replace("/(auth)/(tabs)/playlists");
    }
  }, [user, segments]);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAppSelector(userSelector);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
