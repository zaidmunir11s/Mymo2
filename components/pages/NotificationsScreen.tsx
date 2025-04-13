import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import Button from "../ui/Button";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Buffer } from "buffer";
import {
  getAlerts,
  getAllPositions,
  getNotifications,
} from "@/api/notificationService";
import Loader from "../ui/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEvents, getServer } from "@/api/eventServices";

export type Tab = "all" | "speed_control" | "geo_fencing";

interface Notification {
  id: string;
  type: Tab;
  title: string;
  message: string;
  device: string;
  time: string;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Speed Control", value: "speed_control" },
  { label: "Geo-fencing", value: "geo_fencing" },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "geo_fencing",
    title: "Physical Interference",
    message: "Physical Interference detected.",
    device: "Device 101",
    time: "3 mins ago",
  },
  {
    id: "2",
    type: "speed_control",
    title: "Acceleration force",
    message: "Acceleration above 0.5g detected.",
    device: "Device 101",
    time: "3 mins ago",
  },
  // Add more sample notifications...
];

const NotificationsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(false);
  const [allNotification, setAllNotification] = useState([]);
  const [counts, setCOunts] = useState({
    all: NOTIFICATIONS.length,
    speed_control: NOTIFICATIONS.filter((n) => n.type === "speed_control")
      .length,
    geo_fencing: NOTIFICATIONS.filter((n) => n.type === "geo_fencing").length,
  });

  const filteredNotifications =
    selectedTab === "all"
      ? allNotification
      : NOTIFICATIONS.filter((n) => n.type === selectedTab);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // const response = await getAllPositions();
        // const response = await getNotifications();
        const response = await getEvents(58);
        // const response_server = await getServer();
        // console.log("response of server is===>", response_server);

        console.log("respose is alert===>00", response);
        setAllNotification([]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loader title=" Loading notifications..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setSelectedTab(tab.value)}
            style={[
              styles.tab,
              selectedTab === tab.value && styles.activeTab,
              Styles.row,
              Styles.gap_4,
            ]}
          >
            <StyledText
              type="subHeading"
              weight={500}
              color={selectedTab === tab.value ? Colors.tint : Colors.grey_100}
            >
              {tab.label}
            </StyledText>
            <View
              style={[
                Styles.icon_20_res,
                Styles.items_center,
                {
                  borderRadius: 20,
                  backgroundColor:
                    selectedTab === tab.value ? Colors.tint : Colors.white,
                },
              ]}
            >
              <StyledText
                type="small"
                color={
                  selectedTab === tab.value ? Colors.white : Colors.grey_50
                }
              >
                {counts[tab.value]}
              </StyledText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* //Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
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
              <TouchableOpacity>
                <Image
                  source={require("@/assets/icons/cross.svg")}
                  style={[Styles.icon_20_res]}
                />
              </TouchableOpacity>
            </View>
            <StyledText
              type="subHeading"
              color={Colors.neutral_text}
              textStyle={styles.title}
            >
              {item.title}
            </StyledText>
            <StyledText type="subHeading" color={Colors.grey_70}>
              {item.message}
            </StyledText>
            <View style={Styles.row_sp_bt}>
              <StyledText type="small" color={Colors.tint}>
                {item.deviceName}
              </StyledText>
              <StyledText type="small" color={Colors.grey_50}>
                {item.time}
              </StyledText>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: "2%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DynamicSize(20),
    backgroundColor: Colors.background,
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
