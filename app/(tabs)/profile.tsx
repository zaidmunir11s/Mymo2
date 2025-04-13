import ProfilePage from "@/components/pages/Profile/ProfilePage";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const profile = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <ProfilePage/>
    </PageWrapper>
  );
};

export default profile;
