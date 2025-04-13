import StyledText from "@/components/StyledText";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import React, { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

type Props = {};

const NotificationsSettingsPage = (props: Props) => {
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [sendViaSms, setSendViaSms] = useState(false);
  const [sendViaEmail, setSendViaEmail] = useState(false);

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
            Notifications
          </StyledText>
        </View>

        <View
          style={[
            Styles.row_sp_bt,
            { marginTop: DynamicSize(24), gap: DynamicSize(24) },
          ]}
        >
          <StyledText
            type="body"
            textStyle={{ fontWeight: 500 }}
            color={Colors.grey_100}
          >
            Push Notifications
          </StyledText>

          <Switch
            trackColor={{ false: Colors.grey_50, true: Colors.tint }}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.8 }] }}
            value={notificationToggle}
            onValueChange={() => setNotificationToggle((prev) => !prev)}
          />
        </View>

        <View
          style={[
            Styles.row_sp_bt,
            { marginTop: DynamicSize(24), gap: DynamicSize(24) },
          ]}
        >
          <StyledText
            type="body"
            textStyle={{ fontWeight: 500 }}
            color={Colors.grey_100}
          >
            Sent System Notifications
          </StyledText>
        </View>

        <View
          style={[
            Styles.row_sp_bt,
            { marginTop: DynamicSize(24), gap: DynamicSize(24) },
          ]}
        >
          <StyledText
            type="subHeading"
            textStyle={{ fontWeight: 400 }}
            color={Colors.grey_100}
          >
            Send via SMS
          </StyledText>

          <Switch
            trackColor={{ false: Colors.grey_50, true: Colors.tint }}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.8 }] }}
            value={sendViaSms}
            onValueChange={() => setSendViaSms((prev) => !prev)}
          />
        </View>

        <View
          style={[
            Styles.row_sp_bt,
            { marginTop: DynamicSize(24), gap: DynamicSize(24) },
          ]}
        >
          <StyledText
            type="subHeading"
            textStyle={{ fontWeight: 400 }}
            color={Colors.grey_100}
          >
            Send via email
          </StyledText>

          <Switch
            trackColor={{ false: Colors.grey_50, true: Colors.tint }}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.8 }] }}
            value={sendViaEmail}
            onValueChange={() => setSendViaEmail((prev) => !prev)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
});

export default NotificationsSettingsPage;
