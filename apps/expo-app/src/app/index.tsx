import { Redirect } from "expo-router";

import { userSelector } from "@/redux/slices/auth";
import { useAppSelector } from "@/redux/store/hooks";

export default function HomePage() {
  const user = useAppSelector(userSelector);

  return user ? (
    <Redirect href="/playlists" />
  ) : (
    <Redirect href="/onboarding" />
  );
}
