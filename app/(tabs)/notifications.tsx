import NotificationsScreen from "@/components/pages/NotificationsScreen";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const Notifications = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <NotificationsScreen/>
    </PageWrapper>
  );
};

export default Notifications;
