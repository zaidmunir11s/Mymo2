import StyledText from "@/components/StyledText";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useAccountDetails } from "@/hooks/useAuth";

type Props = {};

const AccountDetailsPage = (props: Props) => {
  const isFocused = useCallback(() => {
    refetch();
  }, []);
  const { data: accountData, isLoading, error, refetch } = useAccountDetails();

  useEffect(() => {
    isFocused();
  }, [isFocused]);
  if (isLoading) {
    return (
      <View style={[Styles.container, styles.container, Styles.items_center]}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  if (error || !accountData) {
    return (
      <View style={[Styles.container, styles.container, Styles.items_center]}>
        <StyledText color={Colors.error} type="body">
          Failed to load account details. Please try again.
        </StyledText>
        <TouchableOpacity style={[Styles.mt_24]} onPress={() => router.back()}>
          <StyledText color={Colors.tint} type="body">
            Go Back
          </StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[Styles.container, styles.container]}>
      <Header />
      <View style={[Styles.container, Styles.mt_24]}>
        <View style={Styles.row_sp_bt}>
          <StyledText
            fontSize={DynamicSize(24)}
            color={Colors.title}
            textStyle={{ fontWeight: 600 }}
          >
            Account Details
          </StyledText>

          <TouchableOpacity
            style={[Styles.row, Styles.gap_8]}
            onPress={() => router.navigate("/(auth)/EditAccountDetails")}
          >
            <Image
              source={require("@/assets/icons/edit-2.svg")}
              style={[Styles.icon_18_res]}
            />
            <StyledText
              type="body"
              color={Colors.tint}
              textStyle={{ fontWeight: 500 }}
            >
              Edit
            </StyledText>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View>
            <StyledText color={Colors.grey_100} type="subHeading">
              Full Name
            </StyledText>
            <View style={styles.detailContainer}>
              <StyledText color={Colors.grey_60} type="subHeading">
                {accountData.name || "Not provided"}
              </StyledText>
            </View>
          </View>

          <View>
            <StyledText color={Colors.grey_100} type="subHeading">
              Email
            </StyledText>
            <View style={styles.detailContainer}>
              <StyledText color={Colors.grey_60} type="subHeading">
                {accountData.email || "Not provided"}
              </StyledText>
            </View>
          </View>

          <View>
            <View style={[Styles.row_sp_bt]}>
              <StyledText color={Colors.grey_100} type="subHeading">
                Mobile Number
              </StyledText>

              <TouchableOpacity
                onPress={() => router.navigate("/(auth)/ChangeNumber")}
              >
                <StyledText color={Colors.tint} type="subHeading">
                  Change Number
                </StyledText>
              </TouchableOpacity>
            </View>
            <View style={styles.detailContainer}>
              <StyledText color={Colors.grey_60} type="subHeading">
                {accountData.phone || "Not provided"}
              </StyledText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
  body: {
    flex: 1,
    marginTop: DynamicSize(36),
    gap: DynamicSize(24),
  },
  detailContainer: {
    marginTop: DynamicSize(12),
    paddingBottom: DynamicSize(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey_10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AccountDetailsPage;
