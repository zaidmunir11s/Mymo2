import React, { useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import StyledText from "../StyledText";
import Styles from "@/constants/Styles";
import { DynamicSize, height } from "@/constants/helpers";
import Button from "../ui/Button";
import { router } from "expo-router";
import Input from "../ui/Input";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";
import AuthFooter from "../ui/AuthFooter";
import { generateUniqueId } from "@/helpers/helpers";

type Props = {};

const RegisterPage = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { mutate: registerUser, isLoading } = useRegister();

  const handleRegister = () => {
    const id = generateUniqueId();
    registerUser({
      id: id,
      name: name,
      email: email,
      password: password,
      phone: phone,
    });
  };

  const onPressSignIn = () => {
    router.back();
  };
  return (
    <PageWrapper>
      <View style={[styles.container]}>
        <View style={[Styles.gap_12, Styles.items_center]}>
          <Image
            source={require("@/assets/icons/logo-logo.svg")}
            style={[styles.logo]}
          />
          <StyledText type="heading" weight={600}>
            MYMO2
          </StyledText>
        </View>
        <Input
          value={name}
          label="Name"
          required
          placeholder="John Doe"
          onChangeText={setName}
        />

        <Input
          value={email}
          label="Email"
          required
          placeholder="ah@gmail.com"
          onChangeText={setEmail}
        />
        <Input
          value={phone}
          label="Phone Number"
          required
          placeholder="(123) 456-7890"
          onChangeText={setPhone}
        />

        <Input
          value={password}
          label="Password"
          required
          placeholder="password"
          onChangeText={setPassword}
        />
        <Button
          title={isLoading ? "Registering..." : "Continue"}
          onPress={handleRegister}
          containerStyle={{ marginTop: DynamicSize(24) }}
          disabled={isLoading}
        />

        <AuthFooter
          text1="Already have an account?"
          text2="Sign in"
          onRegisterPress={onPressSignIn}
        />
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DynamicSize(24),
  },
  logo: {
    height: DynamicSize(142),
    width: DynamicSize(124),
  },
  phoneContainer: {
    marginTop: DynamicSize(60),
    width: "100%",
    gap: DynamicSize(12),
  },
});

export default RegisterPage;
