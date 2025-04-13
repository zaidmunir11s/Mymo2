import { Image } from "expo-image";
import React, { SetStateAction } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "../StyledText";
import Button from "./Button";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import { router } from "expo-router";

type Props = {
  modalVisible: boolean;
  setModalVisible: any;
};

const NumberChnagedModal = ({ modalVisible, setModalVisible }: Props) => {
  const onDonePress = () => {
    setModalVisible(false);
    router.navigate("/(tabs)/profile");
  };
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("@/assets/icons/checkmark.svg")}
            style={styles.successIcon}
          />
          <StyledText
            fontSize={22}
            color={Colors.title}
            textStyle={{ fontWeight: "500", textAlign: "center" }}
          >
            Number Changed Successfully
          </StyledText>
          <Button
            title="Done"
            onPress={() => onDonePress()}
            containerStyle={styles.doneButton}
          />
        </View>
      </View>
    </Modal>
  );
};

export default NumberChnagedModal;

const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 66,
    height: 66,
    marginBottom: 16,
  },
  doneButton: {
    width: "100%",
    marginTop: 24,
  },
});
