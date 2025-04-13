import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import StyledText from "../StyledText";

type Props = {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
};

const NotificationMenu = ({ title, icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[Styles.row_sp_bt, styles.container]}
      onPress={onPress}
    >
      <View style={[Styles.row, Styles.gap_12]}>
        <Image
          source={icon}
          style={[Styles.icon_24_res, { tintColor: Colors.tint }]}
        />
        <StyledText
          type="body"
          textStyle={{ fontWeight: 500 }}
          color={Colors.grey_100}
        >
          {title}
        </StyledText>
      </View>

      <Image
        source={require("@/assets/icons/Vector.svg")}
        style={[{ tintColor: Colors.grey_100 }, Styles.icon_7_12_res]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey_10,
    height: DynamicSize(48),
    paddingRight: DynamicSize(10),
  },
});

export default NotificationMenu;
