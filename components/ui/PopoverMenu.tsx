import React, { useState, useRef } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";

interface PopoverMenuProps {
  options: { 
    label: string; 
    onPress: () => void;
  icon: ImageSourcePropType
 }[];
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ options }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<TouchableOpacity | null>(null);

  const toggleMenu = () => {
    if (visible) {
      setVisible(false);
      return;
    }

    // Close menu first before setting position to avoid flickering
    setVisible(false);
    setPosition(null);

    setTimeout(() => {
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        setPosition({ top: y + height - DynamicSize(20), left: x - width - DynamicSize(100) });
        setVisible(true);
      });
    }, 50); // Small delay ensures UI update
  };

  return (
    <View>
      {/* Three-Dot Button */}
      <TouchableOpacity ref={buttonRef} onPress={toggleMenu}>
        <Image
          source={require("@/assets/icons/3dot.svg")}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Popover Menu */}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />
        {position && (
          <View
            style={[
              styles.menuContainer,
              { top: position.top, left: position.left },
            ]}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, Styles.row]}
                onPress={() => {
                  option.onPress();
                  setVisible(false);
                }}
              >
                <Image source={option.icon} style={[Styles.icon_20_res]} />
                <StyledText type="body" weight={500} color={option.label === 'Edit' ? Colors.tint : Colors.error}>
                  {option.label}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: DynamicSize(24),
    height: DynamicSize(24),
  },
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: Colors.white,
    padding: DynamicSize(8),
    borderRadius: DynamicSize(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: DynamicSize(8),
    paddingHorizontal: DynamicSize(12),
    gap: DynamicSize(8)
  },
});

export default PopoverMenu;
