import AddAlertPage from "@/components/pages/AddAlert";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const AddAlert = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <AddAlertPage />
    </PageWrapper>
  );
};

export default AddAlert;
