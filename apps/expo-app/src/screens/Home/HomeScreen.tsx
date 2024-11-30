import { memo } from "react";

import Background from "../../components/Background";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Paragraph from "../../components/Paragraph";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { userSelector } from "../../redux/slices/auth";
import { useAppSelector } from "../../redux/store/hooks";
import { RootStackScreenProps } from "../../types/types";

const HomeScreen = ({}: RootStackScreenProps<"HomeScreen">) => {
  const user = useAppSelector(userSelector);
  const { onLogout } = useFirebaseAuth();

  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>

      <Paragraph>
        Welcome {user?.displayName}. Your amazing app starts here. Open you
        favourite code editor and start editing this project.
      </Paragraph>
      <Button mode="outlined" onPress={() => onLogout()}>
        Logout
      </Button>
    </Background>
  );
};

export default memo(HomeScreen);
