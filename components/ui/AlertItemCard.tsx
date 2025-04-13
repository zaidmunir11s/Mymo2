import React from "react";
import { View, Switch, StyleSheet } from "react-native";
import PopoverMenu from "./PopoverMenu"; // Adjust path to PopoverMenu
import StyledText from "../StyledText";
import Styles from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";

// TypeScript types for the props
interface AlertItemCardProps {
  item: {
    id: string;
    attributes: {
      name: string;
      device: string;
      speedLimit: string;
      notifyOptions: string;
      description: string;
      activeAlert: string;
    };
  };
  switchStates: Record<string, boolean>;
  toggleSwitch: (id: string) => void;
  onPressEditMenuBtn: (id: string) => void;
  onPressDeleteMenuBtn: (id: string) => void;
}

const AlertItemCard: React.FC<AlertItemCardProps> = ({
  item,
  switchStates,
  toggleSwitch,
  onPressEditMenuBtn,
  onPressDeleteMenuBtn,
}) => {
  return (
    <View key={item.id} style={[styles.card, Styles.gap_12]}>
      <View style={[Styles.row_sp_bt]}>
        <View style={[Styles.row, Styles.gap_8]}>
          <Switch
            trackColor={{
              false: Colors.grey_50,
              true: Colors.tint,
            }}
            style={{ transform: [{ scaleX: 1 }, { scaleY: 0.9 }] }}
            value={item.attributes.activeAlert}
            onValueChange={() => toggleSwitch(item)}
          />
          <View
            style={{
              width: 2,
              height: DynamicSize(16),
              backgroundColor: switchStates[item.id]
                ? Colors.tint
                : Colors.dark_lilac,
            }}
          />
          <StyledText type="title" weight={500}>
            {item.attributes.name}
          </StyledText>
        </View>
        <PopoverMenu
          options={[
            {
              label: "Edit",
              onPress: () => onPressEditMenuBtn(item),
              icon: require("@/assets/icons/edit.svg"),
            },
            {
              label: "Delete",
              onPress: () => onPressDeleteMenuBtn(item?.id),
              icon: require("@/assets/icons/trash.svg"),
            },
          ]}
        />
      </View>
      <StyledText type="body" weight={400} color={Colors.grey_80}>
        Device {item.attributes?.device?.id}
      </StyledText>
      <View style={[Styles.row, Styles.gap_8]}>
        <StyledText type="body" weight={500} color={Colors.grey_100}>
          {item.attributes.speedLimit}
        </StyledText>
        <View
          style={[
            {
              paddingHorizontal: DynamicSize(12),
              paddingVertical: DynamicSize(4),
              borderRadius: DynamicSize(4),
              backgroundColor: Colors.coral_blue_light,
            },
          ]}
        >
          <StyledText color={Colors.coral_blue} type="subHeading">
            {item.attributes.notifyOptions}
          </StyledText>
        </View>
      </View>
      <StyledText type="subHeading" weight={400} color={Colors.grey_50}>
        {item.attributes.description}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey_10,
    paddingBottom: DynamicSize(12),
  },
});

export default AlertItemCard;
