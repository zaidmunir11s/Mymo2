import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  LayoutRectangle,
  GestureResponderEvent,
  Dimensions,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DynamicSize } from "@/constants/helpers";
import { Colors } from "@/constants/Colors";

interface DropdownItem {
  id: string | number;
  label: string;
  count?: number;
  name: string;
}

interface CustomDropdownProps {
  placeholder?: string;
  itemWidth?: number;
  labelFontSize?: number;
  itemFontSize?: number;
  containerStyle?: ViewStyle;
  items: DropdownItem[];
  dropDownContainerStyle?: ViewStyle;
  onSelect: (item: DropdownItem) => void;
  value?: any;
  buttonStyle?: ViewStyle;
  dropdownPadding?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  placeholder = "Select an option",
  itemWidth = DynamicSize(100),
  labelFontSize = DynamicSize(14),
  itemFontSize = DynamicSize(16),
  containerStyle = {},
  items = [],
  dropDownContainerStyle,
  onSelect,
  value,
  buttonStyle,
  dropdownPadding,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<DropdownItem | null>(value);
  const animation = useRef(new Animated.Value(0)).current;
  const triggerRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] =
    useState<LayoutRectangle | null>(null);

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const screenWidth = Dimensions.get("window").width;
        const screenHeight = Dimensions.get("window").height;
        const dropdownHeight = items.length * DynamicSize(40); // Approximate dropdown height
        const dropdownWidth = width + DynamicSize(dropdownPadding ?? 40); // Adjust width

        let adjustedX = pageX;
        let adjustedY = pageY + height; // Default: show dropdown below

        // If dropdown overflows on the right, shift it left
        if (pageX + dropdownWidth > screenWidth) {
          adjustedX = screenWidth - dropdownWidth - 10; // Keep some padding
        }

        // If dropdown overflows at the bottom, show it above
        if (pageY + height + dropdownHeight > screenHeight) {
          adjustedY = pageY - dropdownHeight;
        }

        setDropdownPosition({
          x: adjustedX,
          y: adjustedY,
          width: dropdownWidth,
          height: dropdownHeight,
        });

        setIsOpen(true);
        Animated.timing(animation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const selectItem = (item: DropdownItem) => {
    setSelected(item);
    onSelect?.(item);
    toggleDropdown();
  };

  useEffect(() => {
    if (value !== selected) {
      setSelected(value);
    }
  }, [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        ref={triggerRef}
        style={[styles.triggerButton, buttonStyle]}
        onPress={toggleDropdown}
        activeOpacity={1}
      >
        <Text style={[styles.triggerText, { fontSize: labelFontSize }]}>
          {selected?.name || selected?.label || placeholder}
        </Text>
        {selected?.count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{selected.count}</Text>
          </View>
        )}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={DynamicSize(16)}
          color={Colors.grey_70}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={toggleDropdown}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, dropDownContainerStyle]}
          activeOpacity={1}
          onPress={toggleDropdown}
        >
          {dropdownPosition && (
            <Animated.View
              style={[
                styles.dropdownList,
                {
                  top: dropdownPosition.y,
                  left: dropdownPosition.x,
                  width: dropdownPosition.width,
                  opacity: animation,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dropdownItem,
                    selected?.id === item.id && {
                      backgroundColor: Colors.light_purple,
                    },
                  ]}
                  onPress={() => selectItem(item)}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#666"
                  />
                  <Text style={[styles.itemText, { fontSize: itemFontSize }]}>
                    {item.label}
                  </Text>
                  {item.count !== undefined && (
                    <Text style={styles.itemCount}>{item.count}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  triggerText: {
    color: "#333",
    marginRight: 6,
  },
  countBadge: {
    backgroundColor: Colors.tint,
    borderRadius: 50,
    height: DynamicSize(20),
    width: DynamicSize(20),
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: DynamicSize(12),
  },
  modalOverlay: {
    flex: 1,
    marginTop: DynamicSize(10),
  },
  dropdownList: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: DynamicSize(190),
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: DynamicSize(8),
  },
  itemText: {
    color: Colors.grey_80,
    marginLeft: DynamicSize(14),
  },
  itemCount: {
    color: Colors.grey_70,
  },
});

export default CustomDropdown;
