import {
  Dimensions,
  StyleSheet,
  Text,
  TextProps,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { StyledTextProps } from "@/constants/types";
import { RFValue } from "react-native-responsive-fontsize";
import { DynamicSize } from "@/constants/helpers";

const StyledText = ({
  type,
  weight,
  textStyle,
  color,
  children,
  fontSize,
  numberOfLines,
}: StyledTextProps & TextProps) => {
  // const { height } = useWindowDimensions()
  const styles = StyleSheet.create({
    heading: {
      fontSize: DynamicSize(fontSize || 32),
    },
    title: {
      fontSize: DynamicSize(fontSize || 18),
    },
    body: {
      fontSize: DynamicSize(fontSize || 16),
    },
    button: {
      fontSize: DynamicSize(fontSize || 16),
    },
    narrow: {
      fontSize: DynamicSize(fontSize || 22),
    },
    subHeading: {
      fontSize: DynamicSize(fontSize || 14),
    },
    small: {
      fontSize: DynamicSize(fontSize || 12),
    }
  });

  return (
    <Text
      style={[
        { color: color || Colors.text },
        type === "heading"
          ? styles.heading
          : type === "subHeading"
          ? styles.subHeading
          : type === "button"
          ? styles.button
          : type === "narrow"
          ? styles.narrow
          : type === 'small' ? styles.small 
          : type === 'body' ? styles.body 
          : type === 'title' ? styles.title 
          : styles.body,
        textStyle,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default React.memo(StyledText);
