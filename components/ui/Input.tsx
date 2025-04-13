import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import StyledText from "../StyledText";

interface InputProps {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  optional?: boolean;
  multiline?: boolean;
  unit?: string;
  editable?: boolean;
  errorText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  required = false,
  value,
  onChangeText,
  placeholder = "",
  keyboardType = "default",
  secureTextEntry = false,
  optional = false,
  multiline = false,
  editable = true,
  unit,
  errorText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.asterisk}>*</Text>}{" "}
        {optional && <Text style={styles.label}>(Optional)</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={Colors.placeholder}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
        autoCapitalize={"none"}
      />
      {/* <StyledText type="subHeading" color={Colors.tint}>
        {unit}
      </StyledText> */}
      {errorText && (
        <StyledText
          type="subHeading"
          color={Colors.tint}
          textStyle={{ marginTop: DynamicSize(8), fontWeight: 600 }}
        >
          {errorText}
        </StyledText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: DynamicSize(4),
  },
  label: {
    fontSize: DynamicSize(15),
    fontWeight: "400",
    color: Colors.title,
    marginBottom: DynamicSize(8),
  },
  asterisk: {
    color: Colors.error,
    fontSize: DynamicSize(16),
  },
  input: {
    height: DynamicSize(56),
    borderWidth: 1,
    borderColor: Colors.grey_10,
    borderRadius: DynamicSize(8),
    paddingHorizontal: DynamicSize(12),
    fontSize: DynamicSize(15),
    color: Colors.text,
    fontFamily: "Poppins-Regular",
  },
  multilineInput: {
    height: DynamicSize(118),
    paddingTop: DynamicSize(12),
  },
});

export default Input;
