import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosInstance";
import { Session } from "@/types/apiTypes";
import { Alert } from "react-native";
import { Buffer } from "buffer";
import axios from "axios";
import { API_URL } from "@/constants/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AccountUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
}

interface RegisterRequest {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  readonly?: boolean;
  administrator?: boolean;
  disabled?: boolean;
  attributes?: object;
  deviceReadonly?: boolean;
  limitCommands?: boolean;
  fixedEmail?: boolean;
}

export const login = async ({
  email,
  password,
}: LoginRequest): Promise<Session | null> => {
  try {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const response = await axiosInstance.post("/session", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    __DEV__ && console.log("Login Response : ", response.data);

    await AsyncStorage.setItem("session", JSON.stringify(response.data));
    await AsyncStorage.setItem(
      "credentials",
      JSON.stringify({ email, password })
    );

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.response && error.response.status === 401) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    } else {
      Alert.alert(
        "Error",
        "Something went wrong. Please check your internet connection."
      );
    }

    return null;
  }
};

export const logout = async () => {
  await AsyncStorage.clear();
  await axiosInstance.delete("/session");
};

export const DeleteAccount = async ({ id }: { id: string }) => {
  // await AsyncStorage.clear();
  // await axiosInstance.delete("/session");

  try {
    const credentialsString = await AsyncStorage.getItem("credentials");

    if (!credentialsString) {
      console.error("No credentials found in AsyncStorage");
      return;
    }

    const { email, password } = JSON.parse(credentialsString);
    const token = Buffer.from(`${email}:${password}`, "utf8").toString(
      "base64"
    );

    const response = axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    return null;
  }
};

export const register = async ({
  name,
  email,
  phone,
  password,
}: RegisterRequest): Promise<any | null> => {
  const payload = {
    name,
    email,
    password,
    phone: phone || "",
    readonly: true,
    administrator: false,
    disabled: false,
    attributes: {},
    deviceReadonly: true,
    limitCommands: true,
    fixedEmail: true,
  };

  try {
    const response = await axiosInstance.post("/users", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    await AsyncStorage.setItem("session", JSON.stringify(response.data));
    await AsyncStorage.setItem(
      "credentials",
      JSON.stringify({ email, password })
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      error.response?.data?.error ||
      "Unexpected error. Please try again.";

    console.error("Register error:", errorMessage);

    Alert.alert("Registration Failed", errorMessage);

    return null;
  }
};

export const checkSession = async () => {
  try {
    const credentials = await AsyncStorage.getItem("credentials");

    if (credentials) {
      const { email, password } = JSON.parse(credentials);
      return await login({ email, password });
    }

    return null;
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
};

// export const updateAccountDetails = async (data: AccountUpdateRequest) => {
//   try {

//     const credentialsString = await AsyncStorage.getItem("credentials");

//         if (!credentialsString) {
//           console.error("No credentials found in AsyncStorage");
//           return;
//         }

//         const { email, password } = JSON.parse(credentialsString);
//         const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64');

//     const session = await AsyncStorage.getItem("session");

//     if (!session) {
//       Alert.alert("Error", "You need to be logged in to update your account.");
//       return null;
//     }

//     const { id } = JSON.parse(session);

//     // TracCAR API requires PUT request to update user information
//     const response = await axiosInstance.put(`/users/${id}`, data, {
//       headers: { Authorization: `Basic ${token}` }
//     });

//     __DEV__ && console.log("Account Update Response:", response.data);

//     // Update the session with new data
//     if (response.data) {
//       const updatedSession = JSON.parse(session);
//       const updatedData = { ...updatedSession, ...response.data };
//       await AsyncStorage.setItem("session", JSON.stringify(updatedData));
//     }

//     return response.data;
//   } catch (error: any) {
//     console.error("Account update error:", error);

//     if (error.response) {
//       if (error.response.status === 401) {
//         Alert.alert("Authentication Error", "Please log in again.");
//       } else if (error.response.status === 400) {
//         Alert.alert("Invalid Data", error.response.data?.message || "Please check your information.");
//       } else {
//         Alert.alert("Error", "Failed to update account. Please try again later.");
//       }
//     } else {
//       Alert.alert("Connection Error", "Please check your internet connection.");
//     }

//     return null;
//   }
// };

export const updateAccountDetails = async (data: AccountUpdateRequest) => {
  try {
    // Get credentials for Basic Auth
    const credentialsString = await AsyncStorage.getItem("credentials");

    if (!credentialsString) {
      console.error("No credentials found in AsyncStorage");
      Alert.alert("Authentication Error", "Please log in again.");
      return null;
    }

    const { email, password } = JSON.parse(credentialsString);
    const token = Buffer.from(`${email}:${password}`, "utf8").toString(
      "base64"
    );

    const session = await AsyncStorage.getItem("session");

    if (!session) {
      Alert.alert("Error", "You need to be logged in to update your account.");
      return null;
    }

    const { id } = JSON.parse(session);

    // TracCAR API requires PUT request to update user information
    const response = await axiosInstance.put(`/users/${id}`, data, {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });

    __DEV__ && console.log("Account Update Response:", response.data);

    // Update the session with new data
    if (response.data) {
      const updatedSession = JSON.parse(session);
      const updatedData = { ...updatedSession, ...response.data };
      await AsyncStorage.setItem("session", JSON.stringify(updatedData));
    }

    return response.data;
  } catch (error: any) {
    console.error("Account update error:", error);

    if (error.response) {
      if (error.response.status === 401) {
        Alert.alert("Authentication Error", "Please log in again.");
      } else if (error.response.status === 400) {
        Alert.alert(
          "Invalid Data",
          error.response.data?.message || "Please check your information."
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to update account. Please try again later."
        );
      }
    } else {
      Alert.alert("Connection Error", "Please check your internet connection.");
    }

    return null;
  }
};

export const updatePhoneNumber = async (phone: string) => {
  return updateAccountDetails({ phone });
};

export const getAccountDetails = async () => {
  try {
    const session = await AsyncStorage.getItem("session");

    if (!session) {
      return null;
    }

    const { id } = JSON.parse(session);

    const response = await axiosInstance.get(`/users/${id}`);

    __DEV__ && console.log("Get Account Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Get account details error:", error);

    if (error.response && error.response.status === 401) {
      Alert.alert("Session Expired", "Please log in again.");
    } else {
      Alert.alert("Error", "Failed to retrieve account details.");
    }

    return null;
  }
};
