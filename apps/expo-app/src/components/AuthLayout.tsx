import { ScrollView, View } from "react-native";

import { AuthError } from "firebase/auth";

import AuthErrorBox from "./AuthErrorBox";
import AuthSuccessBox from "./AuthSuccessBox";
import BackButton from "./BackButton";
import Background from "./Background";
import Header from "./Header";

interface Props {
  children?: JSX.Element | JSX.Element[];
  navigationLink?: () => void;
  title?: string;
  header?: JSX.Element;
  footer?: JSX.Element;
  error?: AuthError;
  success?: string;
}

export default function AuthLayout({
  children,
  navigationLink,
  title,
  header,
  footer,
  error,
  success,
}: Props) {
  return (
    <Background>
      <BackButton goBack={navigationLink} />
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View className="p-10">
          {header && <View>{header}</View>}
          {title && <Header>{title}</Header>}
          {error && <AuthErrorBox error={error} />}
          {success && <AuthSuccessBox message={success} />}
          {children}
          {footer && <View>{footer}</View>}
        </View>
        <View style={{ paddingBottom: 50 }}></View>
      </ScrollView>
    </Background>
  );
}
