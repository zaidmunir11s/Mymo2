import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
    onSearch,
    searchValue,
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

    return (
      <View style={[styles.header, style]}>
        <StyledText
          type="heading"
          color={Colors.title}
          textStyle={{ fontWeight: 600 }}
        >
          Tracking
        </StyledText>

        <View style={styles.tabContainer}>
          {viewOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.tab,
                selectedView === option.label && styles.activeTab,
              ]}
              onPress={() => onViewChange(option)}
            >
              <StyledText
                type="body"
                color={selectedView === option.label ? Colors.white : Colors.grey_70}
              >
                {option.label}
              </StyledText>
            </TouchableOpacity>
          ))}
        </View>

        <SearchBar
          value={searchValue}
          onChangeText={onSearch}
          placeholder="Search by device name or ID"
        />

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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.grey_10,
    borderRadius: DynamicSize(10),
    padding: DynamicSize(4),
    marginBottom: DynamicSize(8),
  },
  tab: {
    flex: 1,
    paddingVertical: DynamicSize(8),
    paddingHorizontal: DynamicSize(16),
    borderRadius: DynamicSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.tint,
  },
});

TrackingHeader.displayName = "TrackingHeader";

export default TrackingHeader;
