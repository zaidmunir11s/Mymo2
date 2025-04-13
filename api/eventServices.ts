import axiosInstance from "./axiosInstance";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Buffer } from "buffer";

export const getEvents = async (  deviceId: number,
  from: string,
  to: string) => {
  try {
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

    const response = await axiosInstance.get(`${API_URL}/reports/events`, {
      params: {
        deviceId,
        from,
        to,
      },
    });

    // The response will contain a list of events, and you can extract the IDs
    const events = response.data; // Array of event objects
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getServer = async () => {
  const response = await axiosInstance.get("/server");
  return response.data;
};
