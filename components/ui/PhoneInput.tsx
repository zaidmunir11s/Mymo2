import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import { Image } from "expo-image";
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
  DARK_THEME,
} from "react-native-country-picker-modal";
import StyledText from "../StyledText";

interface PhoneInputProps {
  value: string;
  onChange: (text: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [country, setCountry] = useState<{
    code: CountryCode;
    callingCode: string;
    flag: string;
  }>({
    code: "US",
    callingCode: "1",
    flag: "https://flagcdn.com/w40/us.png",
  });

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (selectedCountry: Country) => {
    setCountry({
      code: selectedCountry.cca2,
      callingCode: selectedCountry.callingCode?.[0] || "1",
      flag: `https://flagcdn.com/w40/${selectedCountry.cca2.toLowerCase()}.png`,
    });
    setPickerVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? Colors.tint : Colors.grey_10 },
      ]}
    >
      {/* Country Picker */}
      <CountryPicker
        withFilter
        withFlag
        withCallingCode
        withModal
        countryCode={country.code}
        visible={isPickerVisible}
        onSelect={handleSelect}
        onClose={() => setPickerVisible(false)}
        renderFlagButton={() => (
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            style={styles.flagButton}
            accessibilityLabel="Select country"
          >
            <View style={styles.flagWrapper}>
              <Image
                source={{ uri: country.flag }}
                style={styles.flag}
                contentFit="fill"
              />
            </View>
            <StyledText type={"body"} color={Colors.bodyText}>
              +{country.callingCode}
            </StyledText>
          </TouchableOpacity>
        )}
      />

      {/* Phone Input */}
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Phone number"
        placeholderTextColor="#777"
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={Colors.tint}
        aria-label="Phone number input"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: DynamicSize(4),
    paddingHorizontal: DynamicSize(16),
    gap: DynamicSize(10),
    height: DynamicSize(53),
  },
  flagButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagWrapper: {
    width: DynamicSize(25),
    height: DynamicSize(17),
    overflow: "hidden",
  },
  flag: {
    width: "100%",
    height: "100%",
  },
  arrowIcon: {
    width: DynamicSize(7),
    height: DynamicSize(7),
    marginLeft: DynamicSize(5),
  },
  input: {
    flex: 1,
    fontSize: DynamicSize(16),
    color: Colors.black, // Light text color for dark theme
    fontFamily: "Poppins-Regular",
  },
});

export default PhoneInput;
