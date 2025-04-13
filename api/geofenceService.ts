import axiosInstance from "./axiosInstance";
import { Geofence } from "@/types/apiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const geofenceKeys = {
  all: ['geofences'] as const,
  lists: () => [...geofenceKeys.all, 'list'] as const,
  list: (filters: string) => [...geofenceKeys.lists(), { filters }] as const,
  details: () => [...geofenceKeys.all, 'detail'] as const,
  detail: (id: number) => [...geofenceKeys.details(), id] as const,
};

// Base API calls
const apiCalls = {
  fetchGeofences: async (): Promise<Geofence[]> => {
    try {
      const response = await axiosInstance.get("/geofences");
      return response.data;
    } catch (error) {
      console.error("Error fetching geofences:", error);
      throw error;
    }
  },

  createGeofence: async (geofence: Geofence): Promise<Geofence> => {
    try {
      const response = await axiosInstance.post("/geofences", geofence);
      return response.data;
    } catch (error) {
      console.error("Error creating geofence:", error);
      throw error;
    }
  },

  updateGeofence: async (geofence: Geofence): Promise<Geofence> => {
    if (!geofence.id) throw new Error("Geofence ID is required for updates");
    try {
      const response = await axiosInstance.put(`/geofences/${geofence.id}`, geofence);
      return response.data;
    } catch (error) {
      console.error("Error updating geofence:", error);
      throw error;
    }
  },

  deleteGeofence: async (geofenceId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/geofences/${geofenceId}`);
    } catch (error) {
      console.error("Error deleting geofence:", error);
      throw error;
    }
  },

  assignGeofenceToDevice: async (deviceId: number, geofenceId: number): Promise<void> => {
    try {
      await axiosInstance.post("/permissions", {
        deviceId,
        geofenceId,
      });
    } catch (error) {
      console.error("Error assigning geofence to device:", error);
      throw error;
    }
  },

  removeGeofenceFromDevice: async (deviceId: number, geofenceId: number): Promise<void> => {
    try {
      await axiosInstance.delete("/permissions", {
        data: { deviceId, geofenceId },
      });
    } catch (error) {
      console.error("Error removing geofence from device:", error);
      throw error;
    }
  },
};

// React Query hooks
export const useGeofences = (options = {}) => {
  return useQuery({
    queryKey: geofenceKeys.lists(),
    queryFn: apiCalls.fetchGeofences,
    ...options,
  });
};

export const useCreateGeofence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiCalls.createGeofence,
    onSuccess: (newGeofence) => {
      // Update the geofences list query with the new geofence
      queryClient.setQueryData(geofenceKeys.lists(), (old: Geofence[] = []) => {
        return [...old, newGeofence];
      });
      
      // Invalidate the query to refetch if needed
      queryClient.invalidateQueries({
        queryKey: geofenceKeys.lists(),
      });
    },
  });
};

export const useUpdateGeofence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiCalls.updateGeofence,
    onSuccess: (updatedGeofence) => {
      // Update the geofences list query with the updated geofence
      queryClient.setQueryData(geofenceKeys.lists(), (old: Geofence[] = []) => {
        return old.map(geofence => 
          geofence.id === updatedGeofence.id ? updatedGeofence : geofence
        );
      });
      
      // Invalidate the query
      queryClient.invalidateQueries({
        queryKey: geofenceKeys.details(),
      });
    },
  });
};

export const useDeleteGeofence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (geofenceId: number) => apiCalls.deleteGeofence(geofenceId),
    onSuccess: (_, geofenceId) => {
      // Update the geofences list query by removing the deleted geofence
      queryClient.setQueryData(geofenceKeys.lists(), (old: Geofence[] = []) => {
        return old.filter(geofence => geofence.id !== geofenceId);
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: geofenceKeys.lists(),
      });
    },
  });
};

export const useAssignGeofenceToDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deviceId, geofenceId }: { deviceId: number; geofenceId: number }) => 
      apiCalls.assignGeofenceToDevice(deviceId, geofenceId),
    onSuccess: () => {
      // Invalidate related queries that might be affected
      queryClient.invalidateQueries({
        queryKey: geofenceKeys.lists(),
      });
    },
  });
};

export const useRemoveGeofenceFromDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deviceId, geofenceId }: { deviceId: number; geofenceId: number }) => 
      apiCalls.removeGeofenceFromDevice(deviceId, geofenceId),
    onSuccess: () => {
      // Invalidate related queries that might be affected
      queryClient.invalidateQueries({
        queryKey: geofenceKeys.lists(),
      });
    },
  });
};

// Export legacy functions for backward compatibility if needed
export const fetchGeofences = apiCalls.fetchGeofences;
export const createGeofence = apiCalls.createGeofence;
export const updateGeofence = apiCalls.updateGeofence;
export const deleteGeofence = apiCalls.deleteGeofence;
export const assignGeofenceToDevice = apiCalls.assignGeofenceToDevice;
export const removeGeofenceFromDevice = apiCalls.removeGeofenceFromDevice;