import { FC, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { pad } from "@chordmaster/utils";
import { router } from "expo-router";
import Dialog from "react-native-dialog";

import useBundler from "@/hooks/useBundler";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import useFirestore from "@/hooks/useFirestore";
import { useLocalization } from "@/hooks/useLocalization";
import { useTheme } from "@/hooks/useTheme";
import AuthErrorBox from "@/components/AuthErrorBox";
import AuthSuccessBox from "@/components/AuthSuccessBox";
import ListItem from "@/components/ListItem";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageView from "@/components/PageView";
import PickerModal from "@/components/PickerModal";
import { exportFile } from "@/utils/exportFile";
import { importFile } from "@/utils/importFile";

import AboutDev from "./components/AboutDev";
import { userSelector } from "@/redux/slices/auth";
import {
  updateUserAppConfigReducer,
  userAppConfigSelector,
} from "@/redux/slices/config";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

const Settings: FC = () => {
  const { t, setLocale, locale, languages } = useLocalization();

  const { theme, setThemeMode: setTheme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const userAppConfig = useAppSelector(userAppConfigSelector);

  const [isLoading, setIsLoading] = useState(false);

  const [activeLanguageSelect, setActiveLanguageSelect] = useState(false);
  const [activeShowTablatureSelect, setActiveShowTablatureSelect] =
    useState(false);
  const [activeEnablePageTurnerSelect, setActiveEnablePageTurnerSelect] =
    useState(false);
  const [activeSetTheme, setActiveSetTheme] = useState(false);

  const fontSize = userAppConfig.fontSize;
  const showTablature = userAppConfig.showTablature;
  const enablePageTurner = userAppConfig.enablePageTurner;

  const [visible, setVisible] = useState(false);

  const { updateUserAppConfig } = useFirestore();
  const {
    onLogout,
    onDeleteAccount,
    authError,
    authSuccess,
    onAppleGetCredentialState,
    appleCredentialState,
  } = useFirebaseAuth();

  const { createBundle, decodeJsonBundle, importBundle } = useBundler();

  const showTablatureOptions = [
    { key: "default-show-true", label: t("show_tabs_by_default"), value: true },
    {
      key: "default-show-false",
      label: t("hide_tabs_by_default"),
      value: false,
    },
  ];

  const enablePageTurnerOptions = [
    {
      key: "page-turner-true",
      label: t("enable_page_turner_by_default"),
      value: true,
    },
    {
      key: "page-turner-false",
      label: t("disable_page_turner_by_default"),
      value: false,
    },
  ];

  // useFocusEffect(
  //   useCallback(() => {
  //     setFontSize(userAppConfig.fontSize);
  //   }, [])
  // );

  const onPressExport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const bundle = await createBundle();
      const bundleString = JSON.stringify(bundle);

      const today = new Date();
      const day = pad(today.getDate());
      const month = pad(today.getMonth() + 1);
      const year = today.getFullYear();
      const filename = `backup-${year}_${month}_${day}`;

      await exportFile("cache", "ChordMaster", filename, ".txt", bundleString);
    } catch (err) {
      Alert.alert("Error", JSON.stringify(err));
      console.warn(err);
    }
    setIsLoading(false);
  };

  const onPressImport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { success, fileContent } = await importFile();

      if (success) {
        const bundle = await decodeJsonBundle(fileContent);

        await importBundle(bundle);
        Alert.alert(t("info"), t("songs_imported_successfully"));
      }
    } catch (_err) {
      Alert.alert(t("error"), t("invalid_file"));
    }
    setIsLoading(false);
  };

  const onChangeTheme = async (value: string) => {
    setTheme(value === "dark" ? "dark" : "light");
  };

  const onChangeLanguage = async (value: string) => {
    if (!user) return;
    await updateUserAppConfig(user.uid, { language: value });
    dispatch(updateUserAppConfigReducer({ language: value }));
    setLocale(value);
  };

  const onChangeShowTablature = async (value: boolean) => {
    if (!user) return;
    await updateUserAppConfig(user.uid, { showTablature: value });
    dispatch(updateUserAppConfigReducer({ showTablature: value }));
  };

  const onChangeEnablePageTurner = async (value: boolean) => {
    if (!user) return;
    await updateUserAppConfig(user.uid, { enablePageTurner: value });
    dispatch(updateUserAppConfigReducer({ enablePageTurner: value }));
  };

  const configureFontSize = () => {
    router.navigate({
      pathname: "/settings/fontsizeselect",
      params: {},
    });
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const accountDelete = async () => {
    try {
      setIsLoading(true);
      await onDeleteAccount();
      setIsLoading(false);
      setVisible(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setVisible(false);
    }
  };
  const ITEM_VERTICAL_PADDING = 16;

  return (
    <PageView>
      <ScrollView style={styles.container}>
        <LoadingIndicator loading={isLoading} />

        <Text
          style={{
            fontSize: 16,
            fontWeight: "normal",
            textAlign: "center",
            color: theme.colors.primary,
            paddingVertical: 10,
          }}>
          Welcome {user?.displayName}!
        </Text>

        {authError && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
            }}>
            <AuthErrorBox error={authError} />
          </View>
        )}
        {authSuccess && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
            }}>
            <AuthSuccessBox message={authSuccess} />
          </View>
        )}

        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={onPressExport}
          title={t("create_backup")}
          subtitle={t("create_backup_description")}
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={onPressImport}
          title={t("import")}
          subtitle={t("import_description")}
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={() => setActiveSetTheme(true)}
          title={"Theme"}
          subtitle={theme.dark ? "dark" : "light"}
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={() => setActiveLanguageSelect(true)}
          title={t("language")}
          subtitle={locale}
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={configureFontSize}
          title={t("text_size")}
          subtitle={fontSize.toString()}
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={() => setActiveShowTablatureSelect(true)}
          title={
            showTablatureOptions.find(o => o.value === showTablature)!.label
          }
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={() => setActiveEnablePageTurnerSelect(true)}
          title={
            enablePageTurnerOptions.find(o => o.value === enablePageTurner)!
              .label
          }
          textStyle={{ color: colors.onBackground }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={onLogout}
          title={t("logout")}
          textStyle={{ color: colors.onBackground, fontWeight: "bold" }}
        />
        <ListItem
          containerStyle={{
            backgroundColor: colors.background,
            borderBottomColor: colors.surfaceDisabled,
          }}
          textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
          onPress={showDialog}
          title={t("account_delete")}
          textStyle={{ color: colors.error, fontWeight: "bold" }}
        />
        {user?.appleUser && (
          <ListItem
            containerStyle={{
              backgroundColor: colors.background,
              borderBottomColor: colors.surfaceDisabled,
            }}
            textContainerStyle={{ paddingVertical: ITEM_VERTICAL_PADDING }}
            onPress={() => onAppleGetCredentialState(user)}
            title={t("get_apple_credential_state")}
            subtitle={appleCredentialState}
            textStyle={{ color: colors.surfaceDisabled, fontSize: 14 }}
          />
        )}
        <AboutDev />
      </ScrollView>
      <PickerModal
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.surfaceDisabled,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        show={activeSetTheme}
        onChange={onChangeTheme}
        onDismiss={() => setActiveSetTheme(false)}
        value={theme.dark ? "dark" : "light"}
        options={[
          {
            key: "theme-option-dark",
            label: "Dark",
            value: "dark",
          },
          {
            key: "theme-option-light",
            label: "Light",
            value: "light",
          },
        ]}
      />
      <PickerModal
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.surfaceDisabled,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        show={activeLanguageSelect}
        onChange={onChangeLanguage}
        onDismiss={() => setActiveLanguageSelect(false)}
        value={locale}
        options={languages.map(l => ({
          key: "lang-option-" + l.code,
          label: l.label,
          description: l.code,
          value: l.code,
        }))}
      />
      <PickerModal
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.surfaceDisabled,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        show={activeShowTablatureSelect}
        onChange={onChangeShowTablature}
        onDismiss={() => setActiveShowTablatureSelect(false)}
        value={showTablature}
        options={showTablatureOptions}
      />
      <PickerModal
        containerStyle={{
          backgroundColor: colors.background,
          borderBottomColor: colors.surfaceDisabled,
        }}
        textStyle={{ color: colors.onBackground }}
        iconColor={colors.onBackground}
        show={activeEnablePageTurnerSelect}
        onChange={onChangeEnablePageTurner}
        onDismiss={() => setActiveEnablePageTurnerSelect(false)}
        value={enablePageTurner}
        options={enablePageTurnerOptions}
      />
      <Dialog.Container visible={visible} verticalButtons={false}>
        <Dialog.Title>Permanently delete account?</Dialog.Title>
        <Dialog.Description>
          When you delete your account, you won't be able to retrieve the
          content or information you've stored.{"\n\n"}
          <Text style={{ color: colors.error, fontWeight: "bold" }}>
            Your account and all your content will be permanently deleted!
          </Text>
          {Platform.OS === "ios" &&
            "\n\nNB! Please do this afterwards to revoke Apple ID access:\n1. On your iPhone, go to Settings, then tap your name.\n2. Tap Password & Security > Apps Using Apple ID.\nSelect the app or developer, then tap Stop Using Apple ID"}
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button
          label="Delete"
          onPress={accountDelete}
          color={colors.error}
          bold={true}
        />
      </Dialog.Container>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Settings;
