import { logout } from "@/api/authService";
import StyledText from "@/components/StyledText";
import NotificationMenu from "@/components/ui/NotificationMenu";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import {
  useAccountDetails,
  useDeleteAccount,
  useLogout,
} from "@/hooks/useAuth";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";

type Props = {};

const ProfilePage = (props: Props) => {
  const logoutMutation = useLogout();

  const { mutate: deleteAccount } = useDeleteAccount();
  const { data: accountData } = useAccountDetails();

  const handleDelete = (userId: string) => {
    Alert.alert("Are you sure?", "This will permanently delete your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAccount({ id: userId }),
      },
    ]);
  };

  return (
    <View style={[Styles.container, styles.container]}>
      <StyledText
        fontSize={DynamicSize(24)}
        color={Colors.title}
        textStyle={{ fontWeight: 600 }}
      >
        Profile
      </StyledText>
      <View style={styles.body}>
        <NotificationMenu
          title={"Account Details"}
          icon={require("@/assets/icons/profile.svg")}
          onPress={() => router.navigate("/(auth)/AccountDetails")}
        />
        <NotificationMenu
          title={"Notifications"}
          icon={require("@/assets/icons/notification-bing.svg")}
          onPress={() => router.navigate("/(auth)/NotificationsSettings")}
        />
        <NotificationMenu
          title={"Privacy Policy"}
          icon={require("@/assets/icons/shield-tick.svg")}
          onPress={() => {}}
        />
        <NotificationMenu
          title={"Terms & Conditions"}
          icon={require("@/assets/icons/document-text.svg")}
          onPress={() => {}}
        />
        <NotificationMenu
          title={"Delete Account"}
          icon={require("@/assets/icons/trash.svg")}
          onPress={() => {
            handleDelete(accountData?.id || "");
          }}
        />
        <NotificationMenu
          title={"Logout"}
          icon={require("@/assets/icons/trash.svg")}
          onPress={() => {
            logoutMutation.mutate();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
  body: {
    marginTop: DynamicSize(24),
  },
});

export default ProfilePage;
