import { Colors } from "@/constants/Colors";
import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

const PageWrapper = (props: Props) => {
  return (
    <SafeAreaView style={[styles.container]}>{props.children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default PageWrapper;
