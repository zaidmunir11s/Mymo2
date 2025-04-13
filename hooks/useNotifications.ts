import { useQuery, useMutation } from "react-query";
import { getNotifications, createNotification, deleteNotification } from "../api/notificationService";

export const useGetNotifications = () => useQuery("notifications", getNotifications);
export const useCreateNotification = () => useMutation(createNotification);
export const useDeleteNotification = () => useMutation(deleteNotification);
