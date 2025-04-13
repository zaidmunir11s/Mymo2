import { Colors } from "@/constants/Colors";
import Styles from "@/constants/Styles";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import StyledText from "../StyledText";

type LoadingComponentProps = {
  title: string;
  color?: string;
};

const Loader: React.FC<LoadingComponentProps> = ({ title, color }) => {
  return (
    <View style={[Styles.container, Styles.items_center]}>
      <>
        <ActivityIndicator size="large" color={color ?? Colors.tint} />
        <StyledText
          type="body"
          color={color ?? Colors.grey_70}
          textStyle={{ marginTop: 10 }}
        >
          {title}
        </StyledText>
      </>
    </View>
  );
};

export default Loader;
