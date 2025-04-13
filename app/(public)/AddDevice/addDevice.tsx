import AddDevice from "@/components/pages/AddDevice";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const addDevice = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />

      <AddDevice />
    </PageWrapper>
  );
};

export default addDevice;
