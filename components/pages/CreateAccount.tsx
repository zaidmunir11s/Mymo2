import Styles from "@/constants/Styles";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Input from "../ui/Input";
import Button from "../ui/Button";

type Props = {};

const CreateAccount = (props: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack()) {
          return true; // Prevent going back
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={styles.conatiner}>
      <StyledText
        fontSize={24}
        color={Colors.title}
        textStyle={{ fontWeight: 600 }}
      >
        Create Account
      </StyledText>

      <View style={[Styles.mt_28, Styles.container, Styles.gap_12]}>
        <Input
          label="Full Name"
          required
          value={name}
          onChangeText={setName}
          placeholder={"Ahmed Hassan"}
        />
        <StyledText type="body" color={Colors.tint}>
          Full name must be atleast 6 letters long
        </StyledText>
        <Input
          label="Email"
          optional
          value={email}
          onChangeText={setEmail}
          placeholder={"Ahmed Hassan@gmail.com"}
        />
      </View>

      <Button
        title="Create"
        onPress={() => {
          router.navigate("/(public)/AddDevice/addDevice");
        }}
        containerStyle={{ marginTop: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    padding: DynamicSize(24),
  },
});
export default CreateAccount;
