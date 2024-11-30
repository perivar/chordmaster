/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type SettingsStackParamList = {
  Settings: undefined;
  FontSizeSelect: undefined;
};

export type MainTabParamList = {
  PlaylistList: undefined;
  ArtistList: undefined;
  SongList: undefined;
  OnlineSearch: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  HomeScreen: undefined;
  MainTab: undefined;
  OnlineArtistView: { serviceName: string; path: string; title: string };
  SongPreview: { serviceName: string; path: string };
  ArtistView: { id: string; title: string };
  SongView: { id: string; title: string };
  SongEdit: undefined | { id: string };
  PlaylistView: { id: string; title: string };
  PlaylistAddSongs: { id: string };
  PlaylistEdit: { id: string };
  AddSongUsingUrl: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type OnboardingStackParamList = {
  OnboardingScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  DebugInfoScreen: undefined;
};

export type OnboardingStackScreenProps<
  T extends keyof OnboardingStackParamList,
> = NativeStackScreenProps<OnboardingStackParamList, T>;
