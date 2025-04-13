import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="addDevice"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="deviceAddingSteps"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
