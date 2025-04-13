import StyledText from "@/components/StyledText";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import { useAccountDetails, useUpdateAccount } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

type Props = {};

const EditAccountDetailsPage = (props: Props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  const { data: accountData, isLoading: detailsLoading } = useAccountDetails();
  const updateAccountMutation = useUpdateAccount();
  
  // Pre-fill form with existing data when loaded
  useEffect(() => {
    if (accountData) {
      setFullName(accountData.name || "");
      setEmail(accountData.email || "");
    }
  }, [accountData]);

  const handleSubmit = () => {
    // Validate input
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    
    // Submit changes
    updateAccountMutation.mutate({ 
      ...accountData,
      name: fullName 
      // Email is not included as it's read-only
    });
  };

  if (detailsLoading) {
    return (
      <View style={[Styles.container, styles.container, Styles.items_center]}>
        <ActivityIndicator size="large" color={Colors.tint} />
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
            Edit Account Details
          </StyledText>
        </View>
        <View style={styles.body}>
          <Input
            label="Full Name"
            required
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            required
            value={email}
            onChangeText={setEmail}
            placeholder="Your email address"
            editable={false}
            errorText={"You cannot change your email. Please contact Admin"}
          />
        </View>

        <Button
          title={updateAccountMutation.isPending ? "Saving..." : "Save Changes"}
          onPress={handleSubmit}
          containerStyle={{ marginTop: "auto" }}
          disabled={updateAccountMutation.isPending || !fullName.trim()}
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
    flex: 1,
    marginTop: DynamicSize(24),
    gap: DynamicSize(24),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EditAccountDetailsPage;