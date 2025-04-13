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
import { useLogin } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";
import AuthFooter from "../ui/AuthFooter";

type Props = {};

const Signin = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/(tabs)/tracking"); // ✅ Redirect to Tabs
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          if (error.response && error.response.status === 401) {
            Alert.alert(
              "Login Failed",
              "Invalid email or password. Please try again."
            );
          } else {
            Alert.alert(
              "Error",
              "Something went wrong. Please check your internet connection."
            );
          }
        },
      }
    );
  };

  const onPressRegisterNowBtn = () => {
    router.navigate("/(auth)/Register");
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
          value={email}
          label="Email"
          required
          placeholder="ah@gmail.com"
          onChangeText={setEmail}
        />
        <Input
          value={password}
          label="Password"
          required
          placeholder="password"
          onChangeText={setPassword}
        />

        <Button
          title={loginMutation.isLoading ? "Logging in..." : "Continue"}
          onPress={handleLogin}
          containerStyle={{ marginTop: DynamicSize(24) }}
          disabled={loginMutation.isLoading}
        />

        <AuthFooter
          text1="Don't have an account?"
          text2="Register Now"
          onRegisterPress={onPressRegisterNowBtn}
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

export default Signin;
