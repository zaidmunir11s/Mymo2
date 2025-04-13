import { Device, Position } from "@/types/apiTypes";
import { StateCreator } from "zustand";

export interface TrackingState {
  devices: Device[];
  positions: Position[];
  setDevices: (devices: Device[]) => void;
  setPositions: (positions: Position[]) => void;
  updatePositions: (newPositions: Position[]) => void; // New method for WebSocket updates
}

export const defaultTrackingState: TrackingState = {
  devices: [],
  positions: [],
  setDevices: (devices) => {},
  setPositions: (positions) => {},
  updatePositions: (newPositions) => {}, // Default implementation
};

const createTrackingState: StateCreator<
  TrackingState,
  [["zustand/persist", unknown]],
  [],
  TrackingState
> = (set, get) => ({
  ...defaultTrackingState,
  setDevices: (devices) => set({ devices }),
  setPositions: (positions) => set({ positions }),

  // New method to update positions from WebSocket data
  updatePositions: (newPositions) => {
    set((state) => {
      // Create a map of existing positions by deviceId for quick lookup
      const positionsMap = new Map(
        state.positions.map((pos) => [pos.deviceId, pos])
      );

      // Process and merge new positions
      newPositions.forEach((newPos) => {
        const existingPos = positionsMap.get(newPos.deviceId);

        // Add last valid coordinates tracking
        const processedPos = {
          ...newPos,
          // If current coordinates are invalid but we have existing valid ones, keep them
          lastValidLatitude:
            newPos.latitude && newPos.latitude !== 0
              ? newPos.latitude
              : existingPos?.lastValidLatitude || existingPos?.latitude,

          lastValidLongitude:
            newPos.longitude && newPos.longitude !== 0
              ? newPos.longitude
              : existingPos?.lastValidLongitude || existingPos?.longitude,
        };

        // Update the position in our map
        positionsMap.set(newPos.deviceId, processedPos);
      });

      // Convert map back to array
      return { positions: Array.from(positionsMap.values()) };
    });
  },
});

export default createTrackingState;
