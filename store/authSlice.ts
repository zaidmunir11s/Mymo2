import { StateCreator } from "zustand";

export interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

export const defaultAuthState: AuthState = {
  token: null,
  setToken: (value) => {},
  clearToken: () => {},
  isAuthenticated: () => false, // Default value
};

const createAuthState: StateCreator<
  AuthState,
  [["zustand/persist", unknown]],
  [],
  AuthState
> = (set, get) => ({
  ...defaultAuthState,
  setToken: (value) => set({ token: value }),
  clearToken: () => set({ token: null }),
  isAuthenticated: () => !!get().token, // ✅ get() is now correctly used
});

export default createAuthState;
