import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import RegisterPage from "@/components/pages/RegisterPage";

const Register = () => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <RegisterPage />
    </PageWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({});
