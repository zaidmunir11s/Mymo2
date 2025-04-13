import GeofenceDetailCard from "@/components/ui/GeofenceDetailCard";
import { useStore } from "@/store/useStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// ✅ Import React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setGeoFenceSheetRef } = useStore();
  const geoFenceSheetRef = useRef<BottomSheetModal>(null);

  // ✅ Create a Query Client (memoized for performance)
  const queryClient = new QueryClient();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setGeoFenceSheetRef(geoFenceSheetRef);
  }, [geoFenceSheetRef]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ✅ Wrap the entire app with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <StatusBar style="dark" />
          {/* <GeofenceDetailCard reference={geoFenceSheetRef} /> */}
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
