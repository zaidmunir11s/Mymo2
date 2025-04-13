import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../ui/Header";
import Styles from "@/constants/Styles";
import { DynamicSize } from "@/constants/helpers";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import Button from "../ui/Button";
import NumberChnagedModal from "../ui/NumberChnageSuccessModal";

type Props = {
  from?: string;
};

const OtpScreen = ({ from }: Props) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [finishModal, setShowFinishModal] = useState<boolean>(false);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 4) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      if (from === "changeNumber") {
        setShowFinishModal(true);
      } else {
        router.replace("/(public)/createAccount");
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={[Styles.container, styles.container]}>
      <Header />
      <View style={[Styles.container, Styles.mt_28]}>
        <StyledText
          fontSize={DynamicSize(24)}
          color={Colors.title}
          textStyle={{ fontWeight: 600 }}
        >
          Verification Code
        </StyledText>
        <StyledText
          type="body"
          color={Colors.grey_80}
          textStyle={[{ fontWeight: 400 }, Styles.mt_8]}
        >
          Please enter the verification code sent to your phone number
        </StyledText>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                styles.otpInput,
                focusedIndex === index && styles.focusedOtpInput,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              returnKeyType="done"
              textAlign="center"
              selectionColor={Colors.tint}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <TouchableOpacity>
            <StyledText
              type="body"
              color={Colors.tint}
              textStyle={{ fontWeight: 600 }}
            >
              Resend code
            </StyledText>
          </TouchableOpacity>
          <StyledText
            type="body"
            color={Colors.grey_80}
            textStyle={{ fontWeight: 400 }}
          >
            Time Remaining : 30 sec
          </StyledText>
        </View>

        <Button
          title="Verify"
          onPress={() => {
            if (from === "changeNumber") {
              setShowFinishModal(true);
            } else {
              router.replace("/(public)/createAccount");
            }
          }}
          containerStyle={{ marginTop: "auto" }}
        />
      </View>

      <NumberChnagedModal
        modalVisible={finishModal}
        setModalVisible={setShowFinishModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
  otpContainer: {
    flexDirection: "row",
    gap: DynamicSize(8),
    marginTop: DynamicSize(40),
    justifyContent: "center",
  },
  otpInput: {
    width: DynamicSize(60),
    height: DynamicSize(60),
    borderWidth: 1,
    borderRadius: DynamicSize(8),
    fontSize: DynamicSize(20),
    textAlign: "center",
    borderColor: Colors.grey_10,
    color: Colors.tint,
    fontFamily: "Poppins-SemiBold",
  },
  focusedOtpInput: {
    backgroundColor: Colors.background, // Highlight color when focused
    borderColor: Colors.tint,
  },
  resendContainer: {
    marginTop: DynamicSize(40),
    justifyContent: "center",
    alignItems: "center",
    gap: DynamicSize(5),
  },
});

export default OtpScreen;
