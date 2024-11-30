import { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Slider from "@react-native-community/slider";

import { useTheme } from "../hooks/useTheme";

import TouchableIcon from "./TouchableIcon";

interface AutoScrollSliderProps {
  show: boolean;
  onClose: () => void;
  onValueChange: (value: number) => void;
}

const AutoScrollSlider: FunctionComponent<AutoScrollSliderProps> = props => {
  const { show, onClose, onValueChange } = props;
  const [isActive, setIsActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(0.5);

  const { theme } = useTheme();
  const { colors } = theme;

  useEffect(() => {
    if (show) {
      setIsActive(true);
    }
  }, [show]);

  useEffect(() => {
    if (isActive) {
      onSliderValueChange(sliderValue);
    }
  }, [isActive]);

  const onSliderValueChange = (value: number) => {
    setSliderValue(value);
    if (isActive) {
      onValueChange(sliderValue);
    }
  };

  const play = () => {
    setIsActive(true);
    onValueChange(sliderValue);
  };

  const stop = () => {
    setIsActive(false);
    onValueChange(0);
  };

  if (!show) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {isActive ? (
          <TouchableIcon
            name="pause"
            onPress={stop}
            color={colors.onBackground}
          />
        ) : (
          <TouchableIcon
            name="play"
            onPress={play}
            color={colors.onBackground}
          />
        )}
        <Slider
          style={{ flex: 1 }}
          value={sliderValue}
          onValueChange={onSliderValueChange}
          onSlidingStart={onSliderValueChange}
          onSlidingComplete={onSliderValueChange}
          minimumValue={0}
          maximumValue={1}
        />
        <TouchableIcon
          name="close"
          onPress={onClose}
          color={colors.onBackground}
        />
      </View>
    );
  }
};

export default AutoScrollSlider;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
});
