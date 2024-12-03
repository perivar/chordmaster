import { useEffect } from "react";

import { Href, router, useSegments } from "expo-router";

import { IAuthUser } from "@/redux/slices/auth";

export function useProtectedRoute(
  user: IAuthUser | undefined,
  loginHref: Href,
  authenticatedHref: Href
) {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && inAuthGroup) {
      // Redirect unauthenticated users to the login page
      router.replace(loginHref);
    } else if (user && !inAuthGroup) {
      // Redirect authenticated users to the main app
      router.replace(authenticatedHref);
    }
  }, [user, segments]);
}
