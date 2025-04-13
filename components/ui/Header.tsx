import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";

type Props = {
  steps?: number;
  active?: number;
};

const Header = ({ steps, active = 1 }: Props) => {
  return (
    <View style={[Styles.row, styles.container]}>
      <TouchableOpacity onPress={router.back}>
        <Image
          source={require("@/assets/icons/arrow-left.svg")}
          style={[Styles.icon_32_res]}
        />
      </TouchableOpacity>

      {steps && (
        <View style={styles.stepsContainer}>
          {Array.from({ length: steps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.step,
                {
                  backgroundColor:
                    index + 1 === active ? Colors.tint : Colors.grey_20,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  step: {
    width: DynamicSize(36),
    height: DynamicSize(2),
    borderRadius: 1000,
  },
});

export default Header;
