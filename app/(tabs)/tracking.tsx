import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, Modal } from "react-native";
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
import RoutePath from "@/components/RoutePath";
import { getPeriodRange } from "@/utils/timeUtils";
import Button from "@/components/ui/Button";
import DateTimePicker from '@react-native-community/datetimepicker';

const CAR_ICON = require("@/assets/images/car.png");
const SELECTED_CAR_ICON = require("@/assets/images/selectedCar.png");

const defaultRegion = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// Time period options
const TIME_PERIODS: DropdownOption[] = [
  { id: "Today", label: "Today", name: "Today" },
  { id: "Yesterday", label: "Yesterday", name: "Yesterday" },
  { id: "This Week", label: "This Week", name: "This Week" },
  { id: "Previous Week", label: "Previous Week", name: "Previous Week" },
  { id: "This Month", label: "This Month", name: "This Month" },
  { id: "Previous Month", label: "Previous Month", name: "Previous Month" },
  { id: "Custom", label: "Custom", name: "Custom" },
];

// DateRangePicker component
const DateRangePicker = ({ visible, onClose, onConfirm }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleFromChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromPicker(false);
    setFromDate(currentDate);
  };

  const handleToChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToPicker(false);
    setToDate(currentDate);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          <StyledText type="body" weight={600} color={Colors.grey_100}>
            Select Date Range
          </StyledText>

          <View style={styles.dateSelectors}>
            <View style={styles.dateSelector}>
              <StyledText type="subHeading" color={Colors.grey_80}>
                From Date
              </StyledText>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowFromPicker(true)}
              >
                <StyledText type="body" color={Colors.grey_100}>
                  {fromDate.toDateString()}
                </StyledText>
              </TouchableOpacity>
              {showFromPicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={handleFromChange}
                />
              )}
            </View>

            <View style={styles.dateSelector}>
              <StyledText type="subHeading" color={Colors.grey_80}>
                To Date
              </StyledText>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowToPicker(true)}
              >
                <StyledText type="body" color={Colors.grey_100}>
                  {toDate.toDateString()}
                </StyledText>
              </TouchableOpacity>
              {showToPicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={handleToChange}
                />
              )}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <StyledText type="body" color={Colors.grey_100}>
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={() => {
                // Set from date to beginning of day
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                
                // Set to date to end of day
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                
                onConfirm(from.toISOString(), to.toISOString());
              }}
            >
              <StyledText type="body" color={Colors.white}>
                Confirm
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Index = () => {
  const { devices, positions, updatePositions } = useStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // refs
  const mapRef = useRef<MapView>(null);

  // Route path state
  const [showRoutePath, setShowRoutePath] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS[0]);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize with today's date range
  useEffect(() => {
    const { from, to } = getPeriodRange("Today");
    setSelectedFromDate(from);
    setSelectedToDate(to);
  }, []);

  const viewOptions = useMemo<DropdownOption[]>(
    () => [
      { id: "Map View", label: "Map View", name: "Map View" },
      { id: "Card View", label: "Card View", name: "Card View" },
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
      { id: "all", label: "All", count: devices.length, name: "All" },
      { id: "active", label: "Active", count: activeDevices, name: "Active" },
      { id: "inactive", label: "Inactive", count: inactiveDevices, name: "Inactive" },
    ];
  }, [devices, positions]);

  const [location, setLocation] = useState(defaultRegion);
  const [state, setState] = useState<TrackingState>({
    region: null,
    markers: [],
    selectedDevice: null,
    selectedView: "Card View",
    selectedDate: TIME_PERIODS[0].label,
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

  const handlePeriodChange = useCallback((option: DropdownOption) => {
    setState((prev) => ({ ...prev, selectedDate: option.label }));
    setSelectedPeriod(option);
    
    if (option.id === "Custom") {
      // Show date picker for custom date range
      setShowDatePicker(true);
    } else {
      // Set date range for route path
      const { from, to } = getPeriodRange(option.id);
      setSelectedFromDate(from);
      setSelectedToDate(to);
      setShowRoutePath(true);
    }
  }, []);

  const handleCustomDateConfirm = (from, to) => {
    setSelectedFromDate(from);
    setSelectedToDate(to);
    setShowDatePicker(false);
    setShowRoutePath(true);
  };

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
    
    // Enable route path visualization when a device is selected
    setShowRoutePath(true);
  }, []);
  
  const handleMarkerPress = useCallback((marker: any) => {
    setState((prev) => ({
      ...prev,
      selectedDevice: prev.selectedDevice?.id === marker.id ? null : marker,
    }));
    
    // Enable route path visualization when a marker is selected
    setShowRoutePath(true);
  }, []);

  // Toggle route visibility
  const toggleRouteVisibility = () => {
    setShowRoutePath(!showRoutePath);
  };

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
              dateOptions={TIME_PERIODS}
              viewOptions={viewOptions}
              statusOptions={statusOptions}
              onViewChange={handleViewChange}
              onDateChange={handlePeriodChange}
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
            dateOptions={TIME_PERIODS}
            viewOptions={viewOptions}
            statusOptions={statusOptions}
            onViewChange={handleViewChange}
            onDateChange={handlePeriodChange}
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

              {/* Add Route Path Visualization */}
              {showRoutePath && state.selectedDevice && (
                <RoutePath
                  deviceId={state.selectedDevice.deviceId}
                  fromDate={selectedFromDate}
                  toDate={selectedToDate}
                  visible={showRoutePath}
                />
              )}

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

          {/* Route Toggle Button */}
          {state.selectedDevice && (
            <TouchableOpacity
              style={[styles.toggleButton, showRoutePath ? styles.toggleButtonActive : {}]}
              onPress={toggleRouteVisibility}
            >
              <StyledText type="small" color={showRoutePath ? Colors.white : Colors.tint}>
                {showRoutePath ? 'Hide Route' : 'Show Route'}
              </StyledText>
            </TouchableOpacity>
          )}

          {state.selectedDevice && (
            <DeviceCard
              fromMap
              device={findDeviceForPosition(state.selectedDevice.id)}
              position={state.selectedDevice}
            />
          )}
          
          {/* Custom Date Range Picker */}
          <DateRangePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onConfirm={handleCustomDateConfirm}
          />
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
  toggleButton: {
    position: 'absolute',
    bottom: DynamicSize(200),
    right: DynamicSize(20),
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(20),
    paddingVertical: DynamicSize(8),
    paddingHorizontal: DynamicSize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  toggleButtonActive: {
    backgroundColor: Colors.tint,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(12),
    padding: DynamicSize(24),
    width: '80%',
    maxWidth: DynamicSize(350),
  },
  dateSelectors: {
    marginTop: DynamicSize(24),
    gap: DynamicSize(16),
  },
  dateSelector: {
    gap: DynamicSize(8),
  },
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.grey_20,
    borderRadius: DynamicSize(4),
    padding: DynamicSize(12),
    backgroundColor: Colors.grey_0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: DynamicSize(24),
    gap: DynamicSize(12),
  },
  button: {
    flex: 1,
    padding: DynamicSize(12),
    borderRadius: DynamicSize(4),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.grey_10,
  },
  confirmButton: {
    backgroundColor: Colors.tint,
  },
});

export default React.memo(Index);