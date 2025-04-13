import EditAccountDetailsPage from "@/components/pages/Profile/EditAccountDetails";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const EditAccountDetails = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <EditAccountDetailsPage/>
    </PageWrapper>
  );
};

export default EditAccountDetails;
