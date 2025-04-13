import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="otpscreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createAccount"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddDevice"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
