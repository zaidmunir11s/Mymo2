import { useStore } from "@/store/useStore";
import axiosInstance from "./axiosInstance";
import { Device, Position } from "@/types/apiTypes";

export const addDevice = async (device: Device) => {
  return await axiosInstance.post("/devices", device);
};

export const deleteDevice = async (id: number) => {
  return await axiosInstance.delete(`/devices/${id}`);
};

export const fetchDevices = async () => {
  try {
    const response = await axiosInstance.get<Device[]>(`/devices`, {});
    useStore.getState().setDevices(response.data);
    __DEV__ && console.log("🚀 Devices Fetched : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
};

export const fetchPositions = async () => {
  try {
    const { devices } = useStore.getState();
    const positionRequests = devices.map((device) =>
      axiosInstance.get<Position[]>(`/positions`, {
        params: { deviceId: device.id },
      })
    );

    const responses = await Promise.all(positionRequests);
    const positions = responses.flatMap((res) => res.data);

    useStore.getState().setPositions(positions);
    __DEV__ && console.log("🚀 Positions Fetched with Addresses: ", positions);
    return positions;
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
};

export const geocodePosition = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await axiosInstance.get(`/server/geocode`, {
      params: { latitude, longitude },
    });

    __DEV__ &&
      console.log(`🚀 Geocoded (${latitude}, ${longitude}): `, response.data);
    return response.data || null;
  } catch (error) {
    console.error(
      `Error geocoding position (${latitude}, ${longitude}):`,
      error
    );
    return null;
  }
};
