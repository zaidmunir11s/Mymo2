import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  style?: ViewStyle
};

const Fab = ({ onZoomIn, onZoomOut, style }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.btn,
          Styles.items_center,
          { borderBottomColor: Colors.tint, borderBottomWidth: 1 }
        ]}
        onPress={onZoomIn}
      >
        <Image
          source={require("@/assets/icons/plus.svg")}
          style={{ height: DynamicSize(18), width: DynamicSize(20) }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, Styles.items_center]}
        onPress={onZoomOut}
      >
        <Image
          source={require("@/assets/icons/minus.svg")}
          style={{ height: DynamicSize(2), width: DynamicSize(14) }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: DynamicSize(8),
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(3),
    height: DynamicSize(80),
    width: DynamicSize(40),
    right: DynamicSize(21),
    bottom: DynamicSize(530),
  },
  btn: {
    flex: 1,
  },
});

export default Fab;
