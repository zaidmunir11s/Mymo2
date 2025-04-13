import Signin from "@/components/pages/Signin";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { useStore } from "@/store/useStore";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {};

// Signin
const index = (props: Props) => {
  const queryClient = new QueryClient();
  const isAuthenticated = useStore.getState().isAuthenticated();
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/tracking" />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <PageWrapper>
        <StatusBar style="dark" />
        <Signin />
      </PageWrapper>
    </QueryClientProvider>
  );
};

export default index;
