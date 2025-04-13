import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/storage/secureStorage";
import createGeneralSlice, { GeneralSlice } from "./generalSlice";
import createAuthState, { AuthState } from "./authSlice";
import createTrackingState, { TrackingState } from "./trackingSlice";

// Helper function to clear storage
export const clearAppStateStorage = async () => {
  await secureStorage.removeItem("app-state");
};

// Define store state type
export type StoreState = GeneralSlice & AuthState & TrackingState;

// Create store with persistence
export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createGeneralSlice(...args),
      ...createAuthState(...args),
      ...createTrackingState(...args),
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => secureStorage),
      // You might want to exclude the bottom sheet ref from persistence
      partialize: (state) => ({
        token: state.token,
        devices: state.devices,
        positions: state.positions,
        // Add any state you want to persist here
        // Example: persistedValue: state.persistedValue
      }),
    }
  )
);
