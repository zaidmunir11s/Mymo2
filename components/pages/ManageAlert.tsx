import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import Button from "../ui/Button";
import { router, useNavigation } from "expo-router";
import Header from "../ui/Header";
import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import AlertItemCard from "../ui/AlertItemCard";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Loader from "../ui/loader";

export type Tab = "all" | "speed_control" | "geo_fencing";

const TABS = [
  { label: "All", value: "all" },
  { label: "Speed Control", value: "speed_control" },
  { label: "Geo-fencing", value: "geo_fencing" },
];

const ManageAlert = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("all");
  const [counts, setCounts] = useState({
    all: 1,
    speed_control: 3,
    geo_fencing: 9,
  });
  const [switchStates, setSwitchStates] = useState({
    brotherCar: false,
    momCar: false,
  });
  const [webToken, setWebToken] = useState(null);

  //al hooks
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  // const [data, setAllAlerts] = useState([]);

  //all useEffect

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
        setWebToken(token);
      } catch (error) {
        console.error("Error setting up WebSocket connection:", error);
      }
    };
    connectWebSocket();
  }, []);

  const getAlertsItem = async () => {
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

      const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["notificaitons"],
    queryFn: getAlertsItem,
  });

  useEffect(() => {
    getAlertsItem();
  }, []);

  const toggleSwitch = async (item: any) => {
    //toggle
    const toggledActiveAlert = !item?.attributes?.activeAlert;

    const payload = {
      id: item?.id,
      type: item?.type,
      attributes: {
        name: item?.attributes?.name,
        device: {
          id: item?.attributes?.device?.id,
          name: item?.attributes?.device?.name,
        },

        description: item?.attributes?.description,
        notifyOptions: item?.attributes?.notifyOptions,
        speedLimit: item?.attributes?.speedLimit,
        activeAlert: toggledActiveAlert,
      },
    };
    try {
      const response = await axiosInstance.put(
        `${API_URL}/notifications/${item?.id}`,
        payload,

        {
          headers: {
            Authorization: `Basic ${webToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status === 200) {
        router.replace("/(auth)/ManageAlert");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response?.data);
        console.log("Status:", error.response?.status);
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  const onPressDeleteMenuBtn = async (id: string): Promise<void> => {
    const url = `${API_URL}/notifications/${id}`;
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
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });
      queryClient.invalidateQueries(["notifications"]);
    } catch (error) {
      console.log("error deleting notificiation", error);
    }
  };

  const onPressEditMenuBtn = (item: {
    always: boolean;
    attributes: {
      description: string;
      device: string;
      name: string;
      notifyOptions: string;
      speedLimit: string;
    };
    calendarId: number;
    commandId: number;
    id: number;
    notificators: any;
    type: string;
  }): void => {
    navigation.navigate("AddAlert", { item });
  };

  //loading

  if (isLoading) {
    return <Loader title=" Loading notifications..." />;
  }

  if (isError) {
    return <Loader title={`Error: ${error.message}`} color={Colors.error} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={[Styles.row_sp_bt]}>
        <StyledText
          fontSize={DynamicSize(24)}
          color={Colors.title}
          textStyle={{ fontWeight: "600" }}
        >
          {"Manage Alerts"}
        </StyledText>
        <Button
          title="Add Alert"
          onPress={() => router.navigate("/(auth)/AddAlert")}
          containerStyle={styles.button}
        />
      </View>

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {selectedTab === "all" &&
            data &&
            data.length > 0 &&
            data.map((item) => (
              <AlertItemCard
                key={item?.id}
                item={item}
                switchStates={switchStates}
                toggleSwitch={toggleSwitch}
                onPressDeleteMenuBtn={onPressDeleteMenuBtn}
                onPressEditMenuBtn={onPressEditMenuBtn}
              />
            ))}

          {selectedTab === "speed_control" &&
            data &&
            data
              .filter((item) => item?.type === "Speed Controll") // Filter by type 'Speed Control'
              .map((item) => (
                <AlertItemCard
                  key={item?.id}
                  item={item}
                  switchStates={switchStates}
                  toggleSwitch={toggleSwitch}
                  onPressDeleteMenuBtn={onPressDeleteMenuBtn}
                  onPressEditMenuBtn={onPressEditMenuBtn}
                />
              ))}

          {selectedTab === "geo_fencing" &&
            data &&
            data
              .filter((item) => item?.type === "Geofencing") // Filter by type 'Speed Control'
              .map((item) => (
                <AlertItemCard
                  key={item?.id}
                  item={item}
                  switchStates={switchStates}
                  toggleSwitch={toggleSwitch}
                  onPressDeleteMenuBtn={onPressDeleteMenuBtn}
                  onPressEditMenuBtn={onPressEditMenuBtn}
                />
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DynamicSize(24),
    backgroundColor: Colors.background,
  },
  body: {
    gap: DynamicSize(24),
    marginTop: DynamicSize(24),
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey_10,
    paddingBottom: DynamicSize(12),
  },
  geoFenceBox: {
    height: DynamicSize(20),
    width: DynamicSize(65),
    borderRadius: DynamicSize(5),
    backgroundColor: Colors.tint,
  },
});

export default ManageAlert;
