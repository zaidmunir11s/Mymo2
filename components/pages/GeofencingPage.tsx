import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { Polygon, Circle, UrlTile } from "react-native-maps";
import GeofencingHeader from "../ui/GeofencingHeader";
import { DynamicSize } from "@/constants/helpers";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Colors } from "@/constants/Colors";
import Fab from "../ui/Fab";
import { zoomIn, zoomOut } from "@/helpers/helpers";
import GeofencesDetails from "../ui/GeofencesDetails";
import { Geofence } from "@/types/apiTypes";
import {
  useGeofences,
  useDeleteGeofence,
  useUpdateGeofence,
} from "@/api/geofenceService";

// Define coordinates type
type Coordinate = {
  latitude: number;
  longitude: number;
};

// Define FenceData type for UI usage
type FenceData = {
  id: string;
  area: string;
  center: Coordinate;
  name: string;
  shape: string;
  size: number;
  color: string;
  enabled: boolean;
};

const defaultRegion = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const GeoFenceScreen = () => {
  const {
    data: geofences,
    isLoading: loading,
    error,
  } = useGeofences({
    // Optional configuration
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      const formattedData = convertToFenceData(data);
      setFenceData(formattedData);
    },
    onError: (err) => {
      console.error("Failed to fetch geofences:", err);
      Alert.alert("Error", "Failed to load geofences");
    },
  });

  const deleteGeofenceMutation = useDeleteGeofence();
  const updateGeofenceMutation = useUpdateGeofence();
  const mapRef = useRef<MapView>(null);
  const [fenceData, setFenceData] = useState<FenceData[]>([]);
  const [location, setLocation] = useState<any>(defaultRegion);
  const [selectedFenceId, setSelectedFenceId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#FF5733");

  const sheetRef = useRef<BottomSheetModalMethods>(null);
  const colorPickerSheetRef = useRef<BottomSheetModalMethods>(null);

  // Parse geofence area function

  const parseGeofenceArea = (area: string) => {
    if (area.startsWith("CIRCLE")) {
      const match = area.match(/CIRCLE\s*\(([\d.-]+) ([\d.-]+), ([\d.]+)\)/);
      if (match) {
        return {
          type: "circle",
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
          radius: parseFloat(match[3]),
        };
      }
    } else if (area.startsWith("POLYGON")) {
      const match = area.match(/POLYGON\s*\(\((.*?)\)\)/);
      if (match) {
        const coordinates = match[1].split(", ").map((coord) => {
          const [lng, lat] = coord.split(" ").map(parseFloat);
          return { latitude: lng, longitude: lat };
        });

        // Calculate center point for the polygon
        const centerLat =
          coordinates.reduce((sum, coord) => sum + coord.latitude, 0) /
          coordinates.length;
        const centerLng =
          coordinates.reduce((sum, coord) => sum + coord.longitude, 0) /
          coordinates.length;

        return {
          type: "polygon",
          coordinates,
          center: { latitude: centerLat, longitude: centerLng },
        };
      }
    }
    return null;
  };

  // Calculate approximate size/radius for polygon
  const calculatePolygonSize = (coordinates: Coordinate[]): number => {
    if (coordinates.length < 3) return 0;

    // Calculate distance from center to furthest point as an approximation
    const centerLat =
      coordinates.reduce((sum, coord) => sum + coord.latitude, 0) /
      coordinates.length;
    const centerLng =
      coordinates.reduce((sum, coord) => sum + coord.longitude, 0) /
      coordinates.length;

    let maxDistance = 0;
    coordinates.forEach((coord) => {
      // Simple distance calculation (approximate)
      const dlat = coord.latitude - centerLat;
      const dlng = coord.longitude - centerLng;
      const distance = Math.sqrt(dlat * dlat + dlng * dlng) * 111000; // rough conversion to meters
      maxDistance = Math.max(maxDistance, distance);
    });

    return maxDistance;
  };

  // Convert Traccar geofences to our FenceData format
  const convertToFenceData = (geofences: Geofence[]): FenceData[] => {
    const colors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A8",
      "#33FFF5",
      "#FF9933",
    ];

    return geofences.map((geofence, index) => {
      const parsed = parseGeofenceArea(geofence.area);
      if (!parsed) {
        // Fallback for unparseable geofences
        return {
          id: geofence.id.toString(),
          area: geofence.area,
          center: defaultRegion,
          name: geofence.name || `Geofence ${geofence.id}`,
          shape: "Unknown",
          size: 100,
          color: geofence.attributes?.color || colors[index % colors.length],
          enabled: true,
        };
      }

      if (parsed.type === "circle") {
        return {
          id: geofence.id.toString(),
          area: geofence.area,
          center: { latitude: parsed.latitude, longitude: parsed.longitude },
          name: geofence.name || `Geofence ${geofence.id}`,
          shape: "Circle",
          size: parsed.radius,
          color: geofence.attributes?.color || colors[index % colors.length],
          enabled: true,
        };
      } else {
        return {
          id: geofence.id.toString(),
          area: geofence.area,
          center: parsed.center,
          name: geofence.name || `Geofence ${geofence.id}`,
          shape: "Polygon",
          size: calculatePolygonSize(parsed.coordinates),
          color: geofence.attributes?.color || colors[index % colors.length],
          enabled: true,
        };
      }
    });
  };

  // Handler functions for FenceData operations
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Geofence",
      "Are you sure you want to delete this geofence?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const numericId = parseInt(id, 10);

            // Update local state immediately for UI responsiveness
            setFenceData((prev) => prev.filter((fence) => fence.id !== id));

            // Use React Query mutation to delete from server
            deleteGeofenceMutation.mutate(numericId, {
              onError: (error) => {
                console.error("Error deleting geofence:", error);
                Alert.alert("Error", "Failed to delete geofence");
                // Revert local state if server delete fails
                if (geofences) {
                  setFenceData(convertToFenceData(geofences));
                }
              },
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleToggle = (id: string) => {
    setFenceData((prev) =>
      prev.map((fence) =>
        fence.id === id ? { ...fence, enabled: !fence.enabled } : fence
      )
    );
  };

  const handleColorChange = (id: string, color: string) => {
    // Find the full geofence object from state
    const selectedGeofence = fenceData.find((fence) => fence.id === id);
    if (!selectedGeofence) return;

    // Ensure `id` is an integer
    const geofenceId = parseInt(id, 10);

    // Construct the full geofence object (ensuring all required fields exist)
    const updatedGeofence = {
      id: geofenceId,
      name: selectedGeofence.name || `Geofence ${geofenceId}`, // Ensure name is always present
      description: selectedGeofence.description || "", // Provide default empty string if missing
      area: selectedGeofence.area, // This must be a string as per API docs
      calendarId: selectedGeofence.calendarId || 0, // Default to 0 if missing
      attributes: {
        ...(selectedGeofence.attributes || {}), // Keep existing attributes
        color, // Update only the color
      },
    };

    // Optimistically update UI before API call
    setFenceData((prev) =>
      prev.map((fence) => (fence.id === id ? { ...fence, color } : fence))
    );

    // Send the full geofence object to the API
    updateGeofenceMutation.mutate(updatedGeofence, {
      onError: (error) => {
        console.error("Error updating geofence:", error);
        Alert.alert("Update Failed", "Could not update geofence color.");
      },
    });

    colorPickerSheetRef.current?.close();
  };

  const openColorPicker = (id: string, currentColor: string) => {
    setSelectedFenceId(id);
    setSelectedColor(currentColor);
    colorPickerSheetRef.current?.present();
  };

  const handleFencePress = (fence: FenceData) => {
    if (mapRef.current) {
      // Adjust zoom level based on fence size
      const sizeInMeters = fence.size;
      let zoomLevel = 0.01; // Default zoom level

      if (sizeInMeters > 5000) {
        zoomLevel = 0.1;
      } else if (sizeInMeters > 1000) {
        zoomLevel = 0.05;
      } else if (sizeInMeters > 500) {
        zoomLevel = 0.02;
      } else if (sizeInMeters > 100) {
        zoomLevel = 0.01;
      } else {
        zoomLevel = 0.005;
      }
      setLocation({
        latitude: fence.center.latitude,
        longitude: fence.center.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      });
      mapRef.current.animateToRegion(
        {
          latitude: fence.center.latitude,
          longitude: fence.center.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        },
        1000
      );
    }
  };

  // Helper function to convert hex color to rgba with opacity
  const hexToRgba = (hex: string, opacity = 0.25): string => {
    // Remove the hash if it exists
    hex = hex.replace("#", "");

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the rgba string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadGeofences = async () => {
      try {
        const formattedData = convertToFenceData(geofences || []);
        setFenceData(formattedData);
      } catch (error) {
        console.error("Error fetching geofences:", error);
      } finally {
        if (isMounted.current) {
          // Nothing to do here after loading
        }
      }
    };

    loadGeofences();
  }, [geofences, loading]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <GeofencingHeader
          style={styles.absolute_header}
          bottomSheetRef={sheetRef}
        />
        {location && (
          <MapView
            key="MapView"
            ref={mapRef}
            style={styles.map}
            initialRegion={location}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              zIndex={0}
            />

            {fenceData
              .filter((fence) => fence.enabled)
              .map((fence, index) => {
                // Parse the area for each fence to get coordinates
                const parsed = parseGeofenceArea(fence.area);
                if (!parsed) return null;

                if (parsed.type === "circle") {
                  return (
                    <Circle
                      key={`circle-${fence.id}`}
                      center={{
                        latitude: parsed.latitude,
                        longitude: parsed.longitude,
                      }}
                      radius={parsed.radius}
                      strokeWidth={2}
                      strokeColor={fence.color}
                      fillColor={hexToRgba(fence.color)}
                    />
                  );
                } else {
                  return (
                    <Polygon
                      key={`polygon-${fence.id}`}
                      coordinates={parsed.coordinates}
                      strokeWidth={2}
                      strokeColor={fence.color}
                      fillColor={hexToRgba(fence.color)}
                    />
                  );
                }
              })}
          </MapView>
        )}
        <Fab
          onZoomIn={() => zoomIn(mapRef, location, setLocation)}
          onZoomOut={() => zoomOut(mapRef, location, setLocation)}
          style={{ bottom: DynamicSize(390) }}
        />
        <GeofencesDetails
          reference={sheetRef}
          fences={fenceData}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onColorChange={handleColorChange}
          onFencePress={handleFencePress}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute_header: {
    position: "absolute",
    top: DynamicSize(30),
    left: DynamicSize(24),
    zIndex: 1,
    width: "88%",
  },
});

export default GeoFenceScreen;
