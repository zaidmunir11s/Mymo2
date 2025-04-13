import NotificationsSettingsPage from "@/components/pages/Profile/NotificationsSettingsPage";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";

type Props = {};

const NotificationsSettings = (props: Props) => {
  return (
    <PageWrapper>
      <StatusBar style="dark" />
      <NotificationsSettingsPage/>
    </PageWrapper>
  );
};

export default NotificationsSettings;
