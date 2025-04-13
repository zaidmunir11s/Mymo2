import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import Button from "../ui/Button";
import { router } from "expo-router";

type Props = {};

const AddDevice = (props: Props) => {
  return (
    <View style={[Styles.container, Styles.items_center, {}]}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/icons/marker.svg")}
          style={[Styles.icon_80_res]}
        />
        <StyledText
          fontSize={24}
          color={Colors.title}
          textStyle={{ fontWeight: 600, textAlign: "center" }}
        >
          Add Your First Device to Begin
        </StyledText>
        <StyledText
          type="body"
          color={Colors.grey_70}
          textStyle={[{ fontWeight: 400, textAlign: "center" }]}
        >
          Set up your device to easily track and manage your devices in
          real-time.
        </StyledText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Device"
          onPress={() =>
            router.navigate("/(public)/AddDevice/deviceAddingSteps")
          }
        />
        <TouchableOpacity onPress={() => router.navigate("/(tabs)/tracking")}>
          <StyledText
            type="body"
            color={Colors.tint}
            textStyle={{ fontWeight: 600 }}
          >
            Don't have a device yet?
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    gap: DynamicSize(16),
    alignItems: "center",
    width: "80%",
  },
  buttonContainer: {
    marginTop: DynamicSize(24),
    gap: DynamicSize(12),
    width: "80%",
    alignItems: "center",
  },
});
export default AddDevice;
