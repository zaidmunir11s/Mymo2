import { useQuery, useMutation } from "react-query";
import { getGeofences, addGeofence, deleteGeofence } from "../api/geofenceService";

export const useGetGeofences = () => useQuery("geofences", getGeofences);
export const useAddGeofence = () => useMutation(addGeofence);
export const useDeleteGeofence = () => useMutation(deleteGeofence);
