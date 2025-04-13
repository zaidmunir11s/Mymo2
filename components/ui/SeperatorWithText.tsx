import React from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";

interface SeparatorWithTextProps {
  text: string;
  lineColor?: string;
  textColor?: string;
}

const SeparatorWithText: React.FC<SeparatorWithTextProps> = ({
  text,
  lineColor = Colors.grey_10,
  textColor = Colors.grey_100,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <StyledText textStyle={styles.text} type="body" color={textColor}>
        {text}
      </StyledText>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1.5,
  },
  text: {
    marginHorizontal: RFValue(12),
  },
});

export default SeparatorWithText;
