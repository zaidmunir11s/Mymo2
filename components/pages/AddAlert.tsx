// import { Colors } from "@/constants/Colors";
// import { DynamicSize } from "@/constants/helpers";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Header from "../ui/Header";
// import StyledText from "../StyledText";
// import Input from "../ui/Input";
// import Button from "../ui/Button";
// import CustomDropdown from "../ui/Select";
// import { DropdownOption } from "@/types/tracking-types";

// type Props = {};

// const AddAlertPage = (props: Props) => {
//   const notificationTypeOptions = useMemo<DropdownOption[]>(
//     () => [
//       { id: 1, label: "speedLimitExceeded" },
//       { id: 2, label: "Geofencing" },
//     ],
//     []
//   );
//   const devices = useMemo<DropdownOption[]>(
//     () => [
//       { id: 1, label: "All Devices" },
//       { id: 2, label: "Device 1" },
//       { id: 3, label: "Device 2" },
//     ],
//     []
//   );

//   const [notificationType, setNotificationType] = useState(
//     notificationTypeOptions[0].label
//   );
//   const [device, setSelectedDevice] = useState(devices[0].label);
//   const [selectedNotifyType, setSelectedNotifyType] = useState("Over");

//   // Dynamic notify options based on notification type
//   const notifyOptions = useMemo(() => {
//     return notificationType === "speedLimitExceeded"
//       ? ["Over", "Below"]
//       : ["Inside Area", "Outside Area"];
//   }, [notificationType]);

//   // Ensure `selectedNotifyType` is valid when `notificationType` changes
//   useEffect(() => {
//     setSelectedNotifyType(notifyOptions[0]);
//   }, [notificationType]);

//   const onTypeChange = (option: DropdownOption) => {
//     setNotificationType(option.label);
//   };
//   return (
//     <View style={styles.container}>
//       <View>
//         <Header />
//         <StyledText
//           fontSize={DynamicSize(24)}
//           color={Colors.title}
//           textStyle={{ fontWeight: "600" }}
//         >
//           Add Alert
//         </StyledText>
//       </View>
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ flexGrow: 1, gap: DynamicSize(12) }}
//         showsVerticalScrollIndicator={false}
//       >
//         <Input
//           value={""}
//           label="Notification Name"
//           required
//           placeholder="Write Description"
//           onChangeText={() => {}}
//         />

//         <View>
//           <Text style={styles.label}>
//             Notification Type <Text style={styles.asterisk}>*</Text>
//           </Text>
//           <CustomDropdown
//             placeholder="Choose an option"
//             labelFontSize={DynamicSize(12)}
//             itemFontSize={DynamicSize(12)}
//             containerStyle={styles.dropdownContainer}
//             dropDownContainerStyle={
//               {
//                 // width: DynamicSize(200)
//               }
//             }
//             items={notificationTypeOptions}
//             onSelect={onTypeChange}
//             value={notificationTypeOptions.find(
//               (item) => item.label === notificationType
//             )}
//             dropdownPadding={0}
//           />
//         </View>

//         <View>
//           <Text style={styles.label}>
//             Device <Text style={styles.asterisk}>*</Text>
//           </Text>
//           <CustomDropdown
//             placeholder="Choose an option"
//             labelFontSize={DynamicSize(12)}
//             itemFontSize={DynamicSize(12)}
//             containerStyle={styles.dropdownContainer}
//             dropDownContainerStyle={
//               {
//                 // width: DynamicSize(200)
//               }
//             }
//             items={devices}
//             onSelect={onTypeChange}
//             value={devices.find((item) => item.label === device)}
//             dropdownPadding={0}
//           />
//         </View>
//         <Input
//           value={""}
//           label="Speed Limit"
//           required
//           placeholder="Enter over speed limit value"
//           onChangeText={() => {}}
//         />

//         <View>
//           <Text style={styles.label}>Notify me when</Text>
//           <View style={styles.notifyType}>
//             {notifyOptions.map((option) => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.notifyTypeBox,
//                   {
//                     backgroundColor:
//                       selectedNotifyType === option
//                         ? Colors.white
//                         : "transparent",
//                   },
//                 ]}
//                 onPress={() => setSelectedNotifyType(option)}
//               >
//                 <StyledText color={Colors.tint} type="title">
//                   {option}
//                 </StyledText>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <Input
//           value={""}
//           label="Description"
//           placeholder="Enter notification name"
//           onChangeText={() => {}}
//           multiline
//         />
//       </ScrollView>

//       <Button
//         title="Add"
//         onPress={() => {}}
//         containerStyle={{ marginTop: "auto" }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: DynamicSize(24),
//     backgroundColor: Colors.background,
//     gap: DynamicSize(24),
//   },
//   label: {
//     marginTop: DynamicSize(4),
//     fontSize: DynamicSize(15),
//     fontWeight: "400",
//     color: Colors.title,
//     marginBottom: DynamicSize(8),
//   },
//   asterisk: {
//     color: Colors.error,
//     fontSize: DynamicSize(16),
//   },
//   dropdownContainer: {
//     width: "100%",
//     height: DynamicSize(56),
//     borderWidth: 1,
//     borderColor: Colors.grey_10,
//     borderRadius: DynamicSize(8),
//     justifyContent: "center",
//   },
//   notifyType: {
//     width: "100%",
//     height: DynamicSize(56),
//     backgroundColor: Colors.lilac,
//     borderRadius: DynamicSize(8),
//     padding: DynamicSize(5),
//     flexDirection: "row",
//   },
//   notifyTypeBox: {
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     borderRadius: DynamicSize(8),
//   },
// });

// export default AddAlertPage;

import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../ui/Header";
import StyledText from "../StyledText";
import Input from "../ui/Input";
import Button from "../ui/Button";
import CustomDropdown from "../ui/Select";
import { DropdownOption } from "@/types/tracking-types";
import { fetchDevices } from "@/api/deviceService";
import { router } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { log } from "console";
import { useRoute } from "@react-navigation/native";
import axiosInstance from "@/api/axiosInstance";
import { createAlert, createNotification } from "@/api/notificationService";

const AddAlertPage = () => {
  const notificationTypeOptions = useMemo<DropdownOption[]>(
    () => [
      { id: 1, label: "speedLimitExceeded", name: "" },
      { id: 2, label: "geofenceEnter", name: "" },
      { id: 3, label: "geofenceExit", name: "" },
    ],
    []
  );

  //all hooks
  const route = useRoute(); // Get route details

  // State Management
  const [notificationName, setNotificationName] = useState("");
  const [speedLimit, setSpeedLimit] = useState("");
  const [description, setDescription] = useState("");

  const [notificationType, setNotificationType] = useState(
    notificationTypeOptions[0].label
  );
  const [selectedNotifyType, setSelectedNotifyType] = useState("Inside Area");
  const [loading, setLoading] = useState(false);
  const [allDevices, setAllDevices] = useState<any[]>([]);

  const [webToken, setWebToken] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(allDevices[2]?.name);
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | number | null
  >(null);
  const [editActive, setEditActive] = useState(false);
  // Dynamic notify options based on notification type
  const notifyOptions = useMemo(() => {
    return notificationType === "speedLimitExceeded"
      ? ["Over", "Below"]
      : ["Inside Area", "Outside Area"];
  }, [notificationType]);

  // Ensure `selectedNotifyType` is valid when `notificationType` changes
  // useEffect(() => {
  //   setSelectedNotifyType(notifyOptions[0]);
  // }, [notificationType]);

  //getDevices
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchDevices();
        setAllDevices(response);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handlers
  const handleAddAlert = () => {
    console.log({
      notificationName,
      notificationType,
      device,
      speedLimit,
      selectedNotifyType,
      description,
    });
  };

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

  const createNotificationHandler = async () => {
    const payload: Notification = {
      type: notificationType, // Ensure `notificationType` is a string
      attributes: {
        name: notificationName, // Ensure `notificationName` is a string
        deviceId: selectedDeviceId, // Ensure `selectedDeviceId` is a string
        deviceName: selectedDevice, // Ensure `selectedDevice` is a string
        speedLimit: speedLimit, // Ensure `speedLimit` is a number
        description: description, // Ensure `description` is a string
        notifyOptions: selectedNotifyType, // Ensure `selectedNotifyType` is a string
        activeAlert: true,
        enabled: true,
      },
    };

    try {
      // Use Promise.all to run both API calls concurrently
      const [alertResponse, notificationResponse] = await Promise.all([
        createAlert(payload), // API call for alert creation
        createNotification(payload), // API call for notification creation
      ]);

      // Check if both responses are successful (status 200)
      if (
        alertResponse?.status === 200 &&
        notificationResponse?.status === 200
      ) {
        console.log("Both Alert and Notification created successfully");
        // Redirect to ManageAlert page after both API calls succeeded
        router.replace("/(auth)/ManageAlert");
      } else {
        // Handle cases where either of the API calls failed
        console.error("One or both of the API calls failed");
      }
    } catch (error) {
      // Handle any error that occurred during either API call
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response?.data);
        console.log("Status:", error.response?.status);
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  //edit logic

  //all routes data

  const { item } = route.params;
  useEffect(() => {
    if (item?.attributes) {
      setNotificationName(item?.attributes?.name);
      setSpeedLimit(item?.attributes?.speedLimit);
      setDescription(item?.attributes?.description);
      setSelectedNotifyType(item?.attributes.notifyOptions);
      setSelectedDevice(item?.attributes?.deviceName);
      setSelectedDeviceId(item?.attributes?.deviceId);
    }
    if (item) {
      setEditActive(true);
      setNotificationType(item?.type);
    }
  }, [item]);

  //updating notifications
  const updateNotificationAlertItem = async (id: string) => {
    const payload = {
      id: id,
      type: notificationType,
      attributes: {
        name: notificationName,
        device: {
          id: selectedDeviceId,
          name: selectedDevice,
        },

        description: description,
        notifyOptions: selectedNotifyType,
        speedLimit: speedLimit,
        activeAlert: true,
      },
    };

    try {
      const response = await axiosInstance.put(
        `${API_URL}/notifications/${id}`,
        payload,

        {
          headers: {
            Authorization: `Basic ${webToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status === 200) {
        setEditActive(false);

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

  // const response = allDevices.find((item) => item?.name === selectedDevice);
  // console.log("respose  is", response);

  console.log("device is===>", allDevices);
  return (
    <View style={styles.container}>
      <View>
        <Header />
        <StyledText
          fontSize={DynamicSize(24)}
          color={Colors.title}
          textStyle={{ fontWeight: "600" }}
        >
          {editActive ? "Edit" : "Add"} Alert
        </StyledText>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, gap: DynamicSize(12) }}
        showsVerticalScrollIndicator={false}
      >
        <Input
          value={notificationName}
          label="Notification Name"
          required
          placeholder="Write Description"
          onChangeText={setNotificationName}
        />

        <View>
          <Text style={styles.label}>
            Notification Type <Text style={styles.asterisk}>*</Text>
          </Text>
          <CustomDropdown
            placeholder="Choose an option"
            labelFontSize={DynamicSize(12)}
            itemFontSize={DynamicSize(12)}
            containerStyle={styles.dropdownContainer}
            items={notificationTypeOptions}
            onSelect={(option) => setNotificationType(option.label)}
            value={notificationTypeOptions.find(
              (item) => item.label === notificationType
            )}
            dropdownPadding={0}
          />
        </View>

        <View>
          <Text style={styles.label}>
            Device <Text style={styles.asterisk}>*</Text>
          </Text>
          <CustomDropdown
            placeholder="Choose an option"
            labelFontSize={DynamicSize(12)}
            itemFontSize={DynamicSize(12)}
            containerStyle={styles.dropdownContainer}
            items={allDevices.map((device) => ({
              label: device?.name,
              value: device?.name,
              id: device?.id,
            }))}
            onSelect={(option) => {
              setSelectedDevice(option?.label);
              setSelectedDeviceId(option?.id);
            }}
            value={allDevices.find((item) => item?.name === selectedDevice)}
            dropdownPadding={0}
          />
        </View>

        {notificationType === "speedLimitExceeded" && (
          <Input
            value={speedLimit}
            label="Speed Limit"
            required
            placeholder="Enter over speed limit value"
            onChangeText={setSpeedLimit}
            unit={"km/hr"}
          />
        )}

        <View>
          <Text style={styles.label}>Notify me when</Text>
          <View style={styles.notifyType}>
            {notifyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.notifyTypeBox,
                  {
                    backgroundColor:
                      selectedNotifyType === option
                        ? Colors.white
                        : "transparent",
                  },
                ]}
                onPress={() => setSelectedNotifyType(option)}
              >
                <StyledText color={Colors.tint} type="title">
                  {option}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          value={description}
          label="Description"
          placeholder="Enter notification details"
          onChangeText={setDescription}
          multiline
        />
      </ScrollView>

      <Button
        title={editActive ? "Update" : "Add"}
        onPress={
          editActive
            ? () => updateNotificationAlertItem(item?.id)
            : createNotificationHandler
        }
        containerStyle={{ marginTop: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DynamicSize(24),
    backgroundColor: Colors.background,
    gap: DynamicSize(24),
  },
  label: {
    marginTop: DynamicSize(4),
    fontSize: DynamicSize(15),
    fontWeight: "400",
    color: Colors.title,
    marginBottom: DynamicSize(8),
  },
  asterisk: {
    color: Colors.error,
    fontSize: DynamicSize(16),
  },
  dropdownContainer: {
    width: "100%",
    height: DynamicSize(56),
    borderWidth: 1,
    borderColor: Colors.grey_10,
    borderRadius: DynamicSize(8),
    justifyContent: "center",
  },
  notifyType: {
    width: "100%",
    height: DynamicSize(56),
    backgroundColor: Colors.lilac,
    borderRadius: DynamicSize(8),
    padding: DynamicSize(5),
    flexDirection: "row",
  },
  notifyTypeBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius: DynamicSize(8),
  },
});

export default AddAlertPage;
