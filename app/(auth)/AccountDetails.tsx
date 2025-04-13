import AccountDetailsPage from "@/components/pages/Profile/AccountDetailsPage";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const AccountDetails = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <AccountDetailsPage />
    </PageWrapper>
  );
};

export default AccountDetails;
