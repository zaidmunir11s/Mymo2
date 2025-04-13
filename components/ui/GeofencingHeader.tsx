import React, { ForwardedRef } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { DynamicSize } from "@/constants/helpers";
import StyledText from "@/components/StyledText";
import { Colors } from "@/constants/Colors";
import SearchBar from "@/components/ui/SearchBar";
import Styles from "@/constants/Styles";
import Button from "./Button";
import { useStore } from "@/store/useStore";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { router } from "expo-router";
import Header from "./Header";

const GeofencingHeader: React.FC<{
  style?: ViewStyle;
  bottomSheetRef?: ForwardedRef<BottomSheetModalMethods>;
  showBackIcon?: boolean;
}> = React.memo(({ style, bottomSheetRef, showBackIcon }) => {
  const { geoFenceSheet } = useStore();
  return (
    <View style={[styles.header, style]}>
      <View style={[Styles.row_sp_bt]}>
        {showBackIcon ? (
          <Header />
        ) : (
          <>
            <StyledText
              type="heading"
              color={Colors.title}
              textStyle={{ fontWeight: 600 }}
            >
              Geofencing
            </StyledText>
            <Button
              title="Add Geofencing"
              onPress={() => {
                router.navigate({
                  pathname: "/(auth)/AddGeofence",
                });
                // bottomSheetRef?.current?.present()
              }}
              containerStyle={{ width: DynamicSize(144) }}
            />
          </>
        )}
      </View>

      <SearchBar />
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    width: "100%",
    gap: DynamicSize(24),
    marginTop: DynamicSize(60),
  },
});

GeofencingHeader.displayName = "GeofencingHeader";

export default GeofencingHeader;
