import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import StyledText from "@/components/StyledText";
import Styles from "@/constants/Styles";
import { DynamicSize, height } from "@/constants/helpers";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/Colors";

type Props = {};

const ChangeNumberPage = (props: Props) => {
  const [phone, setPhone] = useState("");

  const onPress = () => {
    router.navigate({
      pathname: "/(public)/otpscreen",
      params: {
        from: "changeNumber",
      },
    });
  };

  return (
    <View style={[styles.container]}>
      <View>
        <Header />
        <StyledText
          fontSize={DynamicSize(24)}
          color={Colors.title}
          textStyle={{ fontWeight: "600" }}
        >
          Change Number
        </StyledText>
      </View>

      <View style={[styles.phoneContainer]}>
        <StyledText type="subHeading">New Mobile Number</StyledText>
        <PhoneInput value={phone} onChange={setPhone} />
      </View>

      <Button
        title={"Save"}
        onPress={() => onPress()}
        containerStyle={{ marginTop: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DynamicSize(24),
  },
  logo: {
    height: DynamicSize(142),
    width: DynamicSize(124),
  },
  phoneContainer: {
    marginTop: DynamicSize(24),
    width: "100%",
    gap: DynamicSize(12),
  },
});

export default ChangeNumberPage;
