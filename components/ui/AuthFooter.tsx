import { GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import React from "react";
import { DynamicSize } from "@/constants/helpers";
import { Colors } from "@/constants/Colors";

interface FooterProps {
  onRegisterPress: (event: GestureResponderEvent) => void;
  text1: string;
  text2: string;
}
const AuthFooter: React.FC<FooterProps> = ({
  text1,
  text2,
  onRegisterPress,
}) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.text}>
        {text1}{" "}
        <Text style={styles.registerText} onPress={onRegisterPress}>
          {text2}
        </Text>
      </Text>
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    marginVertical: DynamicSize(10),
  },
  text: {
    fontSize: DynamicSize(16),
    fontWeight: "400",
    color: Colors.title,
    marginBottom: DynamicSize(8),
  },
  registerText: {
    color: Colors.tint,
    fontWeight: "500",
  },
});
