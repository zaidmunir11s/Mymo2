import GeoFencePage from "@/components/pages/GeofencingPage";
import Styles from "@/constants/Styles";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {};

const geofencing = (props: Props) => {
  return (
    <View style={[Styles.container]}>
      <StatusBar style="dark" />
      <GeoFencePage />
    </View>
  );
};

const styles = StyleSheet.create({});

export default geofencing;
