import { useQuery, useMutation } from "react-query";
import { getDevices, addDevice, deleteDevice } from "../api/deviceService";

export const useGetDevices = () => useQuery("devices", getDevices);
export const useAddDevice = () => useMutation(addDevice);
export const useDeleteDevice = () => useMutation(deleteDevice);
