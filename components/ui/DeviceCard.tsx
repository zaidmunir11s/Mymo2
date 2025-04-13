import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { formatDate } from "@/utils/dateUtils";
import { Position } from "@/types/apiTypes";
import { geocodePosition } from "@/api/deviceService";

type Props = {
  fromMap?: boolean;
  device?: any;
  position?: Position;
  onPress?: () => {};
};

const DeviceCard = ({ fromMap = false, device, position, onPress }: Props) => {
  const [showAddress, setShowAddress] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState<string>("");

  // Set defaults if props are not provided
  const active = position?.valid ?? false;
  const speed = position?.speed ?? 0;
  const fixTime = position?.fixTime ? new Date(position.fixTime) : new Date();
  const formattedDate = formatDate(fixTime, "DD MMM YYYY");
  const address = fetchedAddress || position?.address || "Unknown Location";
  const deviceName = device?.name || "Device Name";
  const deviceId = device?.id || "N/A";
  const hasGeoFencing = device?.geofenceIds?.length > 0 || false;
  const hasSpeedControl = device?.attributes?.speedLimit !== undefined || false;

  useEffect(() => {
    setShowAddress(false);
    setFetchedAddress("");
  }, [position]);

  const fetchAddress = async () => {
    if (!position?.latitude || !position?.longitude) return;
    setLoadingAddress(true);
    try {
      const response = await geocodePosition(
        position.latitude,
        position.longitude
      );
      setFetchedAddress(response || "Unknown location");
    } catch (error) {
      console.error("Error fetching address:", error);
      setFetchedAddress("Unknown location");
    } finally {
      setLoadingAddress(false);
      setShowAddress(true);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          position: fromMap ? "absolute" : "relative",
          bottom: fromMap ? DynamicSize(130) : DynamicSize(0),
          boxShadow: fromMap
            ? "0px 0px 24px 0px rgba(0,0,0,0.75)"
            : "0px 0px 12px 0px rgba(0,0,0,0.3)",
          width: fromMap ? "90%" : "95%",
        },
      ]}
      onPress={onPress}
    >
      {/* Device Name */}
      <View style={[Styles.row, { gap: DynamicSize(16) }]}>
        <Image
          source={require('@/assets/images/phone.png')}
          style={[Styles.icon_40_res, { borderRadius: DynamicSize(6) }]}
        />

        <View style={Styles.gap_4}>
          <StyledText color={Colors.tint} type="body">
            {deviceName}
          </StyledText>
          <View style={Styles.row}>
            <StyledText color={Colors.grey_70} type="subHeading">
              Device ID: {deviceId} |{" "}
            </StyledText>
            <StyledText
              color={active ? Colors.tint : Colors.error}
              type="subHeading"
            >
              {active ? "Active" : "Inactive"}
            </StyledText>
          </View>
        </View>
        <StyledText
          type="subHeading"
          color={Colors.grey_70}
          textStyle={{ alignSelf: "flex-start", marginLeft: "auto" }}
        >
          {formattedDate}
        </StyledText>
      </View>

      <View style={[Styles.row, Styles.mt_12, Styles.gap_10]}>
        {hasGeoFencing && (
          <View
            style={[
              styles.chip,
              Styles.items_center,
              { backgroundColor: Colors.light_green },
            ]}
          >
            <StyledText type="small" color={Colors.green}>
              Geo-fencing
            </StyledText>
          </View>
        )}

        {hasSpeedControl && (
          <View
            style={[
              styles.chip,
              Styles.items_center,
              { backgroundColor: Colors.light_blue },
            ]}
          >
            <StyledText type="small" color={Colors.blue}>
              Speed Control
            </StyledText>
          </View>
        )}
      </View>

      <View
        style={[
          Styles.mt_12,
          Styles.pt_12,
          Styles.row,
          Styles.gap_8,
          { width: "100%", borderTopWidth: 1, borderTopColor: Colors.grey_10 },
        ]}
      >
        <Image
          source={require("@/assets/icons/location.svg")}
          style={[Styles.icon_20_res]}
        />

        <View style={[Styles.gap_4, { width: "65%" }]}>
          <StyledText type="small" color={Colors.grey_50}>
            Last Location
          </StyledText>
          {showAddress ? (
            loadingAddress ? (
              <ActivityIndicator size="small" color={Colors.tint} />
            ) : (
              <StyledText type="subHeading" color={Colors.grey_90}>
                {address}
              </StyledText>
            )
          ) : (
            <TouchableOpacity
              onPress={fetchAddress}
              style={styles.showAddressButton}
              disabled={!active}
            >
              <StyledText type="small" color={Colors.tint}>
                Show Address
              </StyledText>
            </TouchableOpacity>
          )}
        </View>

        <StyledText
          type="subHeading"
          color={Colors.grey_90}
          textStyle={{ marginLeft: "auto" }}
        >
          {speed.toFixed(2)} km/hr
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: DynamicSize(20),
    borderWidth: 1,
    borderColor: Colors.grey_0,
    padding: DynamicSize(16),
    backgroundColor: Colors.white,
    alignSelf: "center",
  },
  chip: {
    paddingHorizontal: DynamicSize(13),
    paddingVertical: DynamicSize(5),
    borderRadius: DynamicSize(6),
  },
  showAddressButton: {
    paddingVertical: DynamicSize(4),
    paddingHorizontal: DynamicSize(8),
    backgroundColor: Colors.light_blue,
    borderRadius: DynamicSize(6),
    alignSelf: "flex-start",
  },
});

export default DeviceCard;
