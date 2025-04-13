import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, Image } from "react-native";
import MapView, { UrlTile, Marker } from "react-native-maps";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { StatusBar } from "expo-status-bar";
import DeviceCard from "@/components/ui/DeviceCard";
import TrackingHeader from "@/components/pages/Tracking/HeaderContent";
import { TrackingState, DropdownOption } from "@/types/tracking-types";
import { fetchDevices, fetchPositions } from "@/api/deviceService";
import { useStore } from "@/store/useStore";
import { Colors } from "@/constants/Colors";
import StyledText from "@/components/StyledText";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CAR_ICON = require("@/assets/images/car.png"); // Import the car image
const SELECTED_CAR_ICON = require("@/assets/images/selectedCar.png"); // Import the car image

const defaultRegion = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const Index = () => {
  const { devices, positions, updatePositions } = useStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  //refs
  const mapRef = useRef<MapView>(null);

  // Generate current date and 3 previous dates for dropdown
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const day = date.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      options.push({
        id: i + 1,
        label: `${day} ${month} ${year}`,
      });
    }

    return options;
  };

  const dateOptions = useMemo(() => generateDateOptions(), []);

  const viewOptions = useMemo<DropdownOption[]>(
    () => [
      { id: "Map View", label: "Map View" },
      { id: "Card View", label: "Card View" },
    ],
    []
  );

  // Update status options to show the actual count of devices
  const statusOptions = useMemo<DropdownOption[]>(() => {
    const activeDevices = devices?.filter((device) =>
      positions.some(
        (position) => position?.deviceId === device.id && position.valid
      )
    ).length;
    const inactiveDevices = devices.length - activeDevices;

    return [
      { id: "all", label: "All", count: devices.length },
      { id: "active", label: "Active", count: activeDevices },
      { id: "inactive", label: "Inactive", count: inactiveDevices },
    ];
  }, [devices, positions]);

  const [location, setLocation] = useState(defaultRegion);
  const [state, setState] = useState<TrackingState>({
    region: null,
    markers: [],
    selectedDevice: null,
    selectedView: "Card View",
    selectedDate: dateOptions[0]?.label || "Today",
    selectedStatus: "All",
  });

  const [filteredDevices, setFilteredDevices] = useState(devices);

  // Update filtered devices to include search functionality
  useEffect(() => {
    let filtered = [...devices];

    // Filter by status
    if (state?.selectedStatus?.toLowerCase() === "active") {
      filtered = devices.filter((device) =>
        positions.some(
          (position) => position.deviceId === device.id && position.valid
        )
      );
    } else if (state?.selectedStatus?.toLowerCase() === "inactive") {
      filtered = devices.filter(
        (device) =>
          !positions.some(
            (position) => position.deviceId === device.id && position.valid
          )
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(query) ||
          device.uniqueId.toLowerCase().includes(query)
      );
    }

    setFilteredDevices(filtered);
  }, [devices, positions, state.selectedStatus, searchQuery]);

  // Calculate filtered positions for map view
  const filteredPositions = useMemo(() => {
    const deviceIds = filteredDevices?.map((device) => device.id);
    return positions.filter((position) =>
      deviceIds.includes(position.deviceId)
    );
  }, [filteredDevices, positions]);

  const handleViewChange = useCallback((option: DropdownOption) => {
    setState((prev) => ({ ...prev, selectedView: option.label }));
  }, []);

  const handleDateChange = useCallback((option: DropdownOption) => {
    setState((prev) => ({ ...prev, selectedDate: option.label }));
  }, []);

  const handleStatusChange = useCallback((option: DropdownOption) => {
    setState((prev) => ({ ...prev, selectedStatus: option.label }));
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleonPressDeviceCard = useCallback((data: any) => {
    setState((prev) => ({
      ...prev,
      selectedDevice:
        data.deviceId === prev.selectedDevice?.deviceId ? null : data,
      selectedView: "Map View",
    }));

    if (data.latitude && data.longitude) {
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.05, // Adjust zoom level if needed
        longitudeDelta: 0.05,
      });
      mapRef?.current?.animateToRegion({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.05, // Adjust zoom level if needed
        longitudeDelta: 0.05,
      });
    }
  }, []);
  const handleMarkerPress = useCallback((marker: any) => {
    setState((prev) => ({
      ...prev,
      selectedDevice: prev.selectedDevice?.id === marker.id ? null : marker,
    }));
  }, []);

  // Find corresponding device for a position
  const findDeviceForPosition = (positionId: any) => {
    const position = positions?.find((p) => p.id === positionId);
    if (position) {
      return devices.find((d) => d.id === position.deviceId);
    }
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchDevices();
        await fetchPositions();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 WebSocket Function to Track Devices in Real-Time
  useEffect(() => {
    const connectWebSocket = async () => {
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

        const ws = new WebSocket("ws://157.245.77.231:8082/api/socket", null, {
          headers: { Authorization: `Basic ${token}` },
        });

        ws.onopen = () => {
          console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.positions && Array.isArray(data.positions)) {
              // Use the new updatePositions method
              updatePositions(data.positions);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => console.error("WebSocket Error:", error);
        ws.onclose = () => console.log("WebSocket Disconnected");

        return ws;
      } catch (error) {
        console.error("Error setting up WebSocket connection:", error);
        return null;
      }
    };

    let webSocket: WebSocket | null = null;
    connectWebSocket().then((ws) => {
      webSocket = ws;
    });

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  // 🔹 Update Map Center when Selected Device Moves
  useEffect(() => {
    if (state.selectedDevice) {
      const updatedPosition = positions.find(
        (pos) => pos.deviceId === state.selectedDevice?.deviceId
      );
      if (updatedPosition) {
        setLocation({
          latitude: updatedPosition.latitude,
          longitude: updatedPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        mapRef?.current?.animateToRegion(
          {
            latitude: updatedPosition.latitude,
            longitude: updatedPosition.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          500 // duration in ms
        );
      }
    }
  }, [positions, state.selectedDevice, updatePositions]);

  if (loading) {
    return (
      <View style={[Styles.container, Styles.items_center]}>
        <ActivityIndicator size="large" color={Colors.tint} />
        <StyledText
          type="body"
          color={Colors.grey_70}
          textStyle={{ marginTop: 10 }}
        >
          Loading tracking data...
        </StyledText>
      </View>
    );
  }

  return (
    <>
      {state.selectedView === "Card View" ? (
        <PageWrapper>
          <View style={{ flex: 1, padding: DynamicSize(24) }}>
            <TrackingHeader
              selectedView={state.selectedView}
              selectedDate={state.selectedDate}
              selectedStatus={state.selectedStatus}
              dateOptions={dateOptions}
              viewOptions={viewOptions}
              statusOptions={statusOptions}
              onViewChange={handleViewChange}
              onDateChange={handleDateChange}
              onStatusChange={handleStatusChange}
              onSearch={handleSearch}
              searchValue={searchQuery}
              style={{ position: "relative" }}
            />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => {
                  const position = positions.find(
                    (p) => p.deviceId === device.id
                  );
                  return (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      position={position || null} // Pass null if no position
                      onPress={
                        position
                          ? () => handleonPressDeviceCard(position)
                          : () => {}
                      } // Disable press if no position
                      disabled={!position} // Style differently if no position
                      from={'Card'}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <StyledText type="body" color={Colors.grey_70}>
                    No devices found matching your filters.
                  </StyledText>
                </View>
              )}
            </ScrollView>
          </View>
        </PageWrapper>
      ) : (
        <View style={Styles.container}>
          <StatusBar style="dark" />
          <TrackingHeader
            selectedView={state.selectedView}
            selectedDate={state.selectedDate}
            selectedStatus={state.selectedStatus}
            dateOptions={dateOptions}
            viewOptions={viewOptions}
            statusOptions={statusOptions}
            onViewChange={handleViewChange}
            onDateChange={handleDateChange}
            onStatusChange={handleStatusChange}
            onSearch={handleSearch}
            searchValue={searchQuery}
            style={styles.absolute_header}
          />
          {location && (
            <MapView style={styles.map} initialRegion={location} ref={mapRef}>
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                zIndex={0}
              />

              {/* Add Car Markers */}
              {filteredPositions.map((position) => (
                <Marker
                  key={position.id}
                  coordinate={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                  }}
                  onPress={() => handleMarkerPress(position)}
                >
                  <View style={styles.markerContainer}>
                    <Image
                      source={position.deviceId === state.selectedDevice?.deviceId ? SELECTED_CAR_ICON : CAR_ICON}
                      style={styles.carIcon}
                      resizeMode="contain"
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          )}

          {state.selectedDevice && (
            <DeviceCard
              fromMap
              device={findDeviceForPosition(state.selectedDevice.id)}
              position={state.selectedDevice}
            />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  absolute_header: {
    position: "absolute",
    top: DynamicSize(80),
    left: DynamicSize(24),
    zIndex: 1,
    width: "88%",
  },
  scrollContent: {
    flexGrow: 1,
    gap: DynamicSize(24),
    paddingTop: DynamicSize(10),
    paddingBottom: DynamicSize(70),
  },
  carIcon: {
    height: DynamicSize(35),
    width: DynamicSize(35),
  },
  selectedCarIcon: {
    height: DynamicSize(45),
    width: DynamicSize(45),
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: DynamicSize(50),
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
});

export default React.memo(Index);
