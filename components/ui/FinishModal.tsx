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
  onAddagainPress: () => void;
};

const FinishModal = ({
  modalVisible,
  setModalVisible,
  onAddagainPress,
}: Props) => {
  const onDonePress = () => {
    setModalVisible(false);
    router.navigate("/(tabs)/tracking");
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
            Device Paired Successfully
          </StyledText>
          <StyledText
            type="body"
            color={Colors.grey_70}
            textStyle={{ textAlign: "center", marginTop: 8 }}
          >
            Your device has been paired successfully
          </StyledText>
          <Button
            title="Done"
            onPress={() => onDonePress()}
            containerStyle={styles.doneButton}
          />
          <TouchableOpacity onPress={onAddagainPress} activeOpacity={1}>
            <StyledText
              type="body"
              color={Colors.grey_80}
              textStyle={{ textAlign: "center", marginTop: DynamicSize(16) }}
            >
              Do you have another device?{" "}
              <StyledText
                color={Colors.tint}
                textStyle={{ fontWeight: "bold" }}
              >
                Add it
              </StyledText>
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FinishModal;

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
    width: "80%",
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
