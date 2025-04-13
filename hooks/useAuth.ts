import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DeleteAccount, login, logout, register } from "../api/authService";
import { useStore } from "@/store/useStore";
import { router } from "expo-router";

import {
  getAccountDetails,
  updateAccountDetails,
  updatePhoneNumber,
  AccountUpdateRequest,
} from "../api/authService";
import { Alert } from "react-native";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.id) {
        useStore.getState().setToken(data.id.toString()); // Ensure data.id exists
      } else {
        console.error("Login response missing 'id' field:", data);
      }
    },
  });
};

interface RegisterRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      if (data?.id) {
        // Save the new user's ID as token (if you're treating ID like a token)
        useStore.getState().setToken(data.id.toString());

        Alert.alert("Success", "User registered successfully.");
        router.replace("/(tabs)/tracking");
      } else {
        console.error("Register response missing 'id' field:", data);
      }
    },
    onError: (error: any) => {
      console.error("Registration error:", error);

      // Try to get meaningful error from backend
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to register. Please try again.";

      Alert.alert("Registration Failed", errorMessage);
    },
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      const store = useStore.getState();
      store.setToken("");
      store.clearToken();
      router.replace("/");
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: DeleteAccount,
    onSuccess: () => {
      router.replace("/");
    },
  });
};

export const useAccountDetails = () => {
  return useQuery({
    queryKey: ["accountDetails"],
    queryFn: getAccountDetails,
  });
};

/**
 * Hook to update account details
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountDetails,
    onSuccess: async () => {
      // Invalidate and refetch the account details
      await queryClient.invalidateQueries({ queryKey: ["accountDetails"] });
      await queryClient.refetchQueries({ queryKey: ["accountDetails"] });
      router.back();
    },
  });
};

/**
 * Hook to update phone number
 */
export const useUpdatePhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePhoneNumber,
    onSuccess: () => {
      // Invalidate and refetch the account details
      queryClient.invalidateQueries({ queryKey: ["accountDetails"] });
      // This will be called after OTP verification
    },
  });
};
