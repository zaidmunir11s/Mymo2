import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

type Props = {
  containerStyle?: ViewStyle
};

const SearchBar = ({containerStyle}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Search Fleet" placeholderTextColor={Colors.subText}/>
      <Image
        source={require("@/assets/icons/search-normal.svg")}
        style={[Styles.icon_24_res]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: DynamicSize(46),
    borderWidth: 1,
    borderColor: Colors.grey_20,
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(10),
    alignItems: "center",
    paddingHorizontal: DynamicSize(15),
    flexDirection: "row",
  },
  input: {
    flex: 1,
    // backgroundColor: 'red',
    fontSize: DynamicSize(14),
    height: DynamicSize(40),
  },
});

export default SearchBar;
