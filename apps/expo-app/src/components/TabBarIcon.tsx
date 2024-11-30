import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export type MaterialCommunityIconName =
  keyof typeof MaterialCommunityIcons.glyphMap;

interface Props {
  focused: boolean;
  color: string;
  size: number;
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}

const TabBarIcon = (props: Props) => {
  let nameUnfocused = props.name;

  const iconName = (props.name + "-outline") as MaterialCommunityIconName;
  if (iconName) {
    nameUnfocused = (props.name + "-outline") as MaterialCommunityIconName;
  }
  return (
    <MaterialCommunityIcons
      name={props.focused ? props.name : nameUnfocused}
      size={25}
      color={props.color}
    />
  );
};
export default TabBarIcon;
