import axiosInstance from "./axiosInstance";
import { Notification } from "@/types/apiTypes";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const getAllPositions = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get("/positions");
  return response.data;
};

export const createNotification = async (notificationData: Notification) => {
  return await axiosInstance.post("/notifications", notificationData);
};

export const deleteNotification = async (id: number) => {
  return await axiosInstance.delete(`/notifications/${id}`);
};

export const createAlert = async (alertData: Notification) => {
  try {
    const response = await axiosInstance.post(
      "http://157.245.77.231:8082/alerts",
      alertData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response; // Return the response to be used by the caller
  } catch (error) {
    throw error; // Rethrow error to be caught in the calling function
  }
};

export const getAlerts = async () => {
  try {
    const response = await axiosInstance.get(
      "http://157.245.77.231:8082/alerts", // Use GET instead of POST
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return response; // Return the response to be used by the caller
  } catch (error) {
    throw error; // Rethrow error to be caught in the calling function
  }
};
