import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle, View } from "react-native";
import StyledText from "../StyledText";

type Props = {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
};

const Button = ({
  title,
  onPress,
  containerStyle,
  leftIcon,
  disabled,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: disabled ? Colors.grey_30 : Colors.tint },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <StyledText type={"body"} color={Colors.background} weight={500}>
          {title}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: DynamicSize(48),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.tint,
    borderRadius: DynamicSize(8),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: DynamicSize(8),
  },
});

export default Button;
