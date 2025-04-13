import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import Button from "../ui/Button";
import { Image } from "expo-image";
import { router } from "expo-router";
import Loader from "../ui/loader";
import { getEvents } from "@/api/eventServices";
import { fetchDevices } from "@/api/deviceService";
import CustomDropdown from "../ui/Select";

const PERIOD_OPTIONS = [
  "Today",
  "Yesterday",
  "This Week",
  "Previous Week",
  "This Month",
  "Previous Month",
].map((label, index) => ({ id: index, label, name: label }));

const getPeriodRange = (period) => {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case "Today":
      start.setHours(0, 0, 0, 0);
      break;
    case "Yesterday":
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 1);
      now.setHours(23, 59, 59, 999);
      break;
    case "This Week":
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case "Previous Week":
      start.setDate(now.getDate() - now.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      now.setDate(start.getDate() + 6);
      now.setHours(23, 59, 59, 999);
      break;
    case "This Month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "Previous Month":
      start.setMonth(now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      now.setMonth(start.getMonth() + 1, 0);
      now.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return {
    from: start.toISOString(),
    to: now.toISOString(),
  };
};

const NotificationsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevices();
        setDevices(data);
        setSelectedDevice(data[0]);
      } catch (err) {
        console.error("Device fetch error:", err);
      }
    };

    loadDevices();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedDevice || !selectedPeriod) return;
      setLoading(true);
      try {
        const { from, to } = getPeriodRange(selectedPeriod.label);
        const events = await getEvents(selectedDevice.id, from, to);
        setNotifications(events);
      } catch (error) {
        console.error("Event fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedDevice, selectedPeriod]);

  return (
    <View style={styles.container}>
      <View style={[Styles.row_sp_bt]}>
        <StyledText
          fontSize={DynamicSize(24)}
          color={Colors.title}
          textStyle={{ fontWeight: "600" }}
        >
          Notifications
        </StyledText>
        <Button
          title="Manage Alert"
          onPress={() => router.navigate("/(auth)/ManageAlert")}
          containerStyle={styles.button}
        />
      </View>

      {/* Dropdowns */}
      <View style={[Styles.row_sp_bt, { marginVertical: 16 }]}>
        <CustomDropdown
          placeholder="Choose an option"
          labelFontSize={DynamicSize(14)}
          itemFontSize={DynamicSize(14)}
          containerStyle={styles.dropdownContainer}
          items={devices.map((device) => ({
            label: device?.name,
            value: device?.name,
            id: device?.id,
          }))}
          onSelect={(option) => {
            setSelectedDevice(option);
          }}
          value={selectedDevice}
          dropdownPadding={0}
        />
        <CustomDropdown
          items={PERIOD_OPTIONS}
          labelFontSize={DynamicSize(14)}
          itemFontSize={DynamicSize(14)}
          containerStyle={styles.dropdownContainer}
          onSelect={setSelectedPeriod}
          value={selectedPeriod}
          placeholder="Select Period"
        />
      </View>

      {/* Notifications List */}
      {loading ? (
        <Loader title="Loading notifications..." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[Styles.row_sp_bt]}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        item.type === "geo_fencing"
                          ? Colors.light_purple
                          : Colors.coral_blue_light,
                    },
                  ]}
                >
                  <StyledText
                    fontSize={DynamicSize(14)}
                    color={
                      item.type === "geo_fencing"
                        ? Colors.tint
                        : Colors.coral_blue
                    }
                    textStyle={styles.label}
                  >
                    {item.type.replace("_", " ")}
                  </StyledText>
                </View>
              </View>
              <StyledText
                type="subHeading"
                color={Colors.neutral_text}
                textStyle={styles.title}
              >
                {item.title}
              </StyledText>
              <StyledText type="subHeading" color={Colors.grey_70}>
                {item?.attributes.description}
              </StyledText>
              <View style={Styles.row_sp_bt}>
                <StyledText type="small" color={Colors.tint}>
                  {item.deviceName}
                </StyledText>
                <StyledText type="small" color={Colors.grey_50}>
                  {new Date(item?.eventTime).toLocaleString()}
                </StyledText>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: "2%" }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DynamicSize(20),
    backgroundColor: Colors.background,
  },
  dropdownContainer: {
    width: "50%",
    height: DynamicSize(56),
    borderWidth: 1,
    borderColor: Colors.grey_10,
    borderRadius: DynamicSize(8),
    justifyContent: "center",
  },

  button: {
    width: DynamicSize(140),
    height: DynamicSize(40),
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: DynamicSize(16),
  },
  tab: {
    paddingVertical: DynamicSize(10),
    paddingHorizontal: DynamicSize(16),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.tint,
  },
  card: {
    backgroundColor: Colors.background,
    padding: DynamicSize(16),
    borderRadius: DynamicSize(12),
    marginBottom: DynamicSize(12),
    boxShadow: "0px 0px 7px 0px rgba(0,0,0,0.3)",
    width: "99%",
    alignSelf: "center",
    gap: DynamicSize(5),
  },
  label: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontWeight: "600",
    marginTop: DynamicSize(4),
  },
  chip: {
    paddingHorizontal: DynamicSize(12),
    paddingVertical: DynamicSize(4),
    borderRadius: DynamicSize(6),
  },
});

export default NotificationsScreen;
