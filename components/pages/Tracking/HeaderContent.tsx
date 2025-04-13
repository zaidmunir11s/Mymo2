import React, { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { DynamicSize } from "@/constants/helpers";
import StyledText from "@/components/StyledText";
import { Colors } from "@/constants/Colors";
import Styles from "@/constants/Styles";
import SearchBar from "@/components/ui/SearchBar";
import CustomDropdown from "@/components/ui/Select";
import { TrackingHeaderProps } from "@/types/tracking-types";

const TrackingHeader: React.FC<TrackingHeaderProps> = React.memo(
  ({
    selectedView,
    selectedDate,
    selectedStatus,
    dateOptions,
    viewOptions,
    statusOptions,
    onViewChange,
    onDateChange,
    onStatusChange,
    style,
  }) => {
    // Memoize the dropdown styles
    const dropdownStyle = useMemo(
      () => ({
        marginBottom: 20,
      }),
      []
    );

    const lastDropdownStyle = useMemo(
      () => ({
        marginBottom: 20,
        marginLeft: -DynamicSize(50),
      }),
      []
    );

    let bgColor =
      viewOptions.find((item) => item.label === selectedView)?.label ===
      "Card View"
        ? Colors.grey_10
        : Colors.white;

    return (
      <View style={[styles.header, style]}>
        <StyledText
          type="heading"
          color={Colors.title}
          textStyle={{ fontWeight: 600 }}
        >
          {viewOptions.find((item) => item.label === selectedView)?.label ===
          "Card View"
            ? "Device Tracking"
            : "Tracking"}
        </StyledText>

        <SearchBar />
        <View style={[Styles.gap_10, Styles.row]}>
          <CustomDropdown
            placeholder="Choose an option"
            itemWidth={DynamicSize(150)}
            labelFontSize={DynamicSize(14)}
            itemFontSize={DynamicSize(16)}
            containerStyle={dropdownStyle}
            items={dateOptions}
            onSelect={onDateChange}
            value={dateOptions.find((item) => item.label === selectedDate)}
            buttonStyle={{ backgroundColor: bgColor }}
          />
          <CustomDropdown
            placeholder="Choose an option"
            itemWidth={DynamicSize(150)}
            labelFontSize={DynamicSize(14)}
            itemFontSize={DynamicSize(16)}
            containerStyle={dropdownStyle}
            items={viewOptions}
            onSelect={onViewChange}
            value={viewOptions.find((item) => item.label === selectedView)}
            buttonStyle={{ backgroundColor: bgColor }}
          />
          <CustomDropdown
            placeholder="Choose an option"
            itemWidth={DynamicSize(150)}
            labelFontSize={DynamicSize(14)}
            itemFontSize={DynamicSize(16)}
            containerStyle={dropdownStyle}
            dropDownContainerStyle={lastDropdownStyle}
            items={statusOptions}
            onSelect={onStatusChange}
            value={statusOptions.find((item) => item.label === selectedStatus)}
            buttonStyle={{ backgroundColor: bgColor }}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    width: "100%",
    gap: DynamicSize(24),
  },
});

TrackingHeader.displayName = "TrackingHeader";

export default TrackingHeader;
