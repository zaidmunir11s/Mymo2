// generalSlice.ts
import { StateCreator } from "zustand";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface GeneralSlice {
  // states
  geoFenceSheet: React.RefObject<BottomSheetModal> | null;
  testing: string;

  // actions
  setGeoFenceSheetRef: (value: React.RefObject<BottomSheetModal>) => void;
  setTesting: (value: string) => void;
}

export const defaultGeneralState: GeneralSlice = {
  geoFenceSheet: null,
  testing: '',

  setGeoFenceSheetRef: () => {},
  setTesting: () => {}
};

const createGeneralSlice: StateCreator<
  GeneralSlice,
  [["zustand/persist", unknown]],
  [],
  GeneralSlice
> = (set) => ({
  ...defaultGeneralState,

  setGeoFenceSheetRef: (value) =>
    set((state) => {
      console.log("Updating geoFenceSheet from:", state.geoFenceSheet, "to:", value);
      return { geoFenceSheet: value };
    }),
  setTesting: (value: string) =>
    set(() => ({ testing: value }))
});

export default createGeneralSlice;
