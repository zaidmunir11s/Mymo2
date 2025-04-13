import AddingDeviceSteps from "@/components/pages/AddingDeviceSteps";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const DeviceAddingSteps = (props: Props) => {
  return (
    <>
      <StatusBar style="dark" />

      <AddingDeviceSteps />
    </>
  );
};

export default DeviceAddingSteps;
