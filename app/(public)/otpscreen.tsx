import OtpScreen from "@/components/pages/OtpScreen";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const otpscreen = (props: Props) => {
  const { from } = useLocalSearchParams();

  return (
    <PageWrapper>
      <StatusBar style="dark" />

      <OtpScreen from={from}/>
    </PageWrapper>
  );
};

export default otpscreen;
