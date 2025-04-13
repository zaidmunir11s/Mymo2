import { Stack } from "expo-router";

export default function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="ManageAlert" options={{ headerShown: false }} />
      <Stack.Screen name="AddAlert" options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetails" options={{ headerShown: false }} />
      <Stack.Screen
        name="EditAccountDetails"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsSettings"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChangeNumber" options={{ headerShown: false }} />
      <Stack.Screen name="AddGeofence" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: false }} />
    </Stack>
  );
}
