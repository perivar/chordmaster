import { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Slider from "@react-native-community/slider";

import SongRender from "../../components/SongRender";
import SongTransformer from "../../components/SongTransformer";
import useFirestore from "../../hooks/useFirestore";
import { useTheme } from "../../hooks/useTheme";
import { userSelector } from "../../redux/slices/auth";
import {
  updateUserAppConfigReducer,
  userAppConfigSelector,
} from "../../redux/slices/config";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 24;
export const FONT_SIZE_STEP = 2;

const FontSizeSelect: FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const userAppConfig = useAppSelector(userAppConfigSelector);

  const [fontSize, setFontSize] = useState(userAppConfig.fontSize);

  const { updateUserAppConfig } = useFirestore();

  const chordSheet =
    "" +
    "This[C] is an example[D] song\n" +
    "Lor[F#m]em ipsum dolor sit ame[G]t\n" +
    "C[C]onsectetur adipiscing elit[D]\n" +
    "Sed do eiusm[F#m]od tempor incididunt u[C]t\n" +
    "labore et dolore magna aliqua\n";

  const onChange = async (value: number) => {
    if (!user) return;
    await updateUserAppConfig(user.uid, { fontSize: value });
    dispatch(updateUserAppConfigReducer({ fontSize: value }));
    setFontSize(value);
  };

  return (
    <View style={[styles.f1, { backgroundColor: colors.background }]}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.f1}
          value={fontSize}
          step={FONT_SIZE_STEP}
          minimumValue={MIN_FONT_SIZE}
          maximumValue={MAX_FONT_SIZE}
          onValueChange={onChange}
        />
        <Text style={[styles.sliderLabel, { color: colors.onBackground }]}>
          {fontSize}
        </Text>
      </View>
      <SongTransformer
        fontSize={fontSize}
        transposeDelta={0}
        chordProSong={chordSheet}>
        {({ htmlSong }) => (
          <View style={styles.f1}>
            <SongRender chordProContent={htmlSong} />
          </View>
        )}
      </SongTransformer>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    borderBottomColor: "#00000020",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  sliderLabel: {
    marginLeft: 10,
  },
  f1: {
    flex: 1,
  },
});

export default FontSizeSelect;
