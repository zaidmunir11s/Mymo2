// import React, { useState } from "react";
// import PageWrapper from "../wrapper/PageWrapper";
// import Header from "../ui/Header";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import Styles from "@/constants/Styles";
// import StyledText from "../StyledText";
// import { Colors } from "@/constants/Colors";
// import { DynamicSize } from "@/constants/helpers";
// import { Image } from "expo-image";
// import Button from "../ui/Button";
// import SeparatorWithText from "../ui/SeperatorWithText";
// import Input from "../ui/Input";
// import * as ImagePicker from "expo-image-picker";
// import FinishModal from "../ui/FinishModal";
// import CameraModal from "../ui/CameraModal";

// type Props = {};

// const steps = [
//   { id: 1, type: "Device On" },
//   { id: 2, type: "Scan" },
//   { id: 3, type: "Naming" },
// ];

// const AddingDeviceSteps = (props: Props) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [image, setImage] = useState<string | null>(null);
//   const [trackerId, setTrackerId] = useState("");
//   const [last4Digits, setLast4Digits] = useState("");
//   const [deviceName, setDeviceName] = useState("");
//   // Server Info
//   // IP: 157.245.77.231
//   // User: root
//   // Pass: PalmLab116X
//   const [finishModal, setShowFinishModal] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(false);

//   const handleScan = (data: string) => {
//     setTrackerId(data);
//     setCameraVisible(false);
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images", "videos"],
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const handleContinue = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const onAddagainPress = () => {
//     setCurrentStep(1), setShowFinishModal(false);
//   };
//   return (
//     <PageWrapper>
//       <View style={[Styles.container, styles.container]}>
//         <Header steps={3} active={currentStep} />

//         {/* Device On Step */}
//         {currentStep === 1 && (
//           <View style={[Styles.container, Styles.mt_24]}>
//             <StyledText
//               fontSize={24}
//               color={Colors.title}
//               textStyle={{ fontWeight: "600" }}
//             >
//               Turn on Device
//             </StyledText>
//             <StyledText
//               type="body"
//               color={Colors.grey_80}
//               textStyle={[{ fontWeight: "400" }, Styles.mt_8]}
//             >
//               Turn on your device by pressing the button on your device.
//             </StyledText>
//             <View style={styles.iconContainer}>
//               <Image
//                 source={require("@/assets/icons/tracker.svg")}
//                 style={[styles.icon]}
//                 contentFit="contain"
//               />
//             </View>

//             <Button
//               title="Continue"
//               onPress={handleContinue}
//               containerStyle={{ marginTop: "auto" }}
//             />
//           </View>
//         )}

//         {/* Scan Step */}
//         {currentStep === 2 && (
//           <View style={[Styles.container, Styles.mt_24, Styles.gap_24]}>
//             <StyledText
//               fontSize={24}
//               color={Colors.title}
//               textStyle={{ fontWeight: "600" }}
//             >
//               Pairing Device
//             </StyledText>

//             <Button
//               title="Scan QR Code"
//               onPress={() => setCameraVisible(true)}
//               containerStyle={{}}
//               leftIcon={
//                 <Image
//                   source={require("@/assets/icons/scan.svg")}
//                   style={[Styles.icon_18_res]}
//                 />
//               }
//             />

//             <SeparatorWithText text="or" />

//             <Input
//               label="Tracker ID"
//               required
//               value={trackerId}
//               onChangeText={setTrackerId}
//               placeholder="Enter Tracker ID"
//             />
//             <Input
//               label="Last 4 digits of tracker"
//               required
//               value={last4Digits}
//               onChangeText={setLast4Digits}
//               placeholder="Enter Last 4 digits of tracker"
//             />

//             <Button
//               title="Continue"
//               disabled={!trackerId || !last4Digits}
//               onPress={handleContinue}
//               containerStyle={{ marginTop: "auto" }}
//             />
//           </View>
//         )}

//         {/* Naming Step */}
//         {currentStep === 3 && (
//           <View style={[Styles.container, Styles.mt_24, Styles.gap_24]}>
//             <TouchableOpacity
//               style={[
//                 Styles.icon_86_res,
//                 Styles.items_center,
//                 styles.galleryContainer,
//               ]}
//               onPress={pickImage}
//             >
//               <Image
//                 source={require("@/assets/icons/gallery-add.svg")}
//                 style={[Styles.icon_40_res]}
//               />
//             </TouchableOpacity>

//             <StyledText
//               fontSize={24}
//               color={Colors.title}
//               textStyle={{ fontWeight: "600" }}
//             >
//               Naming Device
//             </StyledText>

//             <Input
//               label="Device Name"
//               required
//               value={deviceName}
//               onChangeText={setDeviceName}
//               placeholder="Enter Device Name"
//             />

//             <Button
//               title="Finish"
//               onPress={() => setShowFinishModal(true)}
//               containerStyle={{ marginTop: "auto" }}
//             />
//           </View>
//         )}
//       </View>

//       <FinishModal
//         modalVisible={finishModal}
//         setModalVisible={setShowFinishModal}
//         onAddagainPress={onAddagainPress}
//       />
//       <CameraModal
//         visible={cameraVisible}
//         onClose={() => setCameraVisible(false)}
//         onScan={handleScan}
//       />
//     </PageWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: DynamicSize(24),
//   },
//   icon: {
//     height: DynamicSize(200),
//     width: DynamicSize(280),
//   },
//   iconContainer: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: DynamicSize(180),
//   },
//   galleryContainer: {
//     backgroundColor: Colors.lilac,
//     borderRadius: DynamicSize(50),
//     alignSelf: "center",
//   },
// });

// export default AddingDeviceSteps;


import React, { useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Header from "../ui/Header";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import Styles from "@/constants/Styles";
import StyledText from "../StyledText";
import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import { Image } from "expo-image";
import Button from "../ui/Button";
import SeparatorWithText from "../ui/SeperatorWithText";
import Input from "../ui/Input";
import * as ImagePicker from "expo-image-picker";
import FinishModal from "../ui/FinishModal";
import CameraModal from "../ui/CameraModal";
import { addDevice } from "@/api/deviceService";

type Props = {};

const steps = [
  { id: 1, type: "Device On" },
  { id: 2, type: "Scan" },
  { id: 3, type: "Naming" },
];

const AddingDeviceSteps = (props: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [trackerId, setTrackerId] = useState("");
  const [last4Digits, setLast4Digits] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [finishModal, setShowFinishModal] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  const handleScan = (data: string) => {
    setTrackerId(data);
    setLast4Digits(data.slice(-4)); // Auto-fill last 4 digits
    setCurrentStep(3); // Proceed directly to naming step
    setCameraVisible(false);
  };

  const handleManualEntry = () => {
    if (trackerId.slice(-4) !== last4Digits) {
      Alert.alert("Error", "Last 4 digits do not match Tracker ID.");
      return;
    }
    setCurrentStep(3);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFinish = async () => {
    try {
      await addDevice({
        name: deviceName,
        uniqueId: trackerId,
        category: "tracker",
      });
      setShowFinishModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to add device. Please try again.");
    }
  };

  const onAddAgainPress = () => {
    setCurrentStep(1);
    setShowFinishModal(false);
  };

  return (
    <PageWrapper>
      <View style={[Styles.container, styles.container]}>
        <Header steps={3} active={currentStep} />

        {/* Device On Step */}
        {currentStep === 1 && (
          <View style={[Styles.container, Styles.mt_24]}>
            <StyledText fontSize={24} color={Colors.title} textStyle={{ fontWeight: "600" }}>
              Turn on Device
            </StyledText>
            <StyledText type="body" color={Colors.grey_80} textStyle={[{ fontWeight: "400" }, Styles.mt_8]}>
              Turn on your device by pressing the button on your device.
            </StyledText>
            <View style={styles.iconContainer}>
              <Image source={require("@/assets/icons/tracker.svg")} style={[styles.icon]} contentFit="contain" />
            </View>
            <Button title="Continue" onPress={() => setCurrentStep(2)} containerStyle={{ marginTop: "auto" }} />
          </View>
        )}

        {/* Scan Step */}
        {currentStep === 2 && (
          <View style={[Styles.container, Styles.mt_24, Styles.gap_24]}>
            <StyledText fontSize={24} color={Colors.title} textStyle={{ fontWeight: "600" }}>
              Pairing Device
            </StyledText>
            <Button title="Scan QR Code" onPress={() => setCameraVisible(true)} leftIcon={<Image source={require("@/assets/icons/scan.svg")} style={[Styles.icon_18_res]} />} />
            <SeparatorWithText text="or" />
            <Input label="Tracker ID" required value={trackerId} onChangeText={setTrackerId} placeholder="Enter Tracker ID" />
            <Input label="Last 4 digits of tracker" required value={last4Digits} onChangeText={setLast4Digits} placeholder="Enter Last 4 digits of tracker" />
            <Button title="Continue" disabled={!trackerId || !last4Digits} onPress={handleManualEntry} containerStyle={{ marginTop: "auto" }} />
          </View>
        )}

        {/* Naming Step */}
        {currentStep === 3 && (
          <View style={[Styles.container, Styles.mt_24, Styles.gap_24]}>
            <StyledText fontSize={24} color={Colors.title} textStyle={{ fontWeight: "600" }}>
              Naming Device
            </StyledText>
            <Input label="Device Name" required value={deviceName} onChangeText={setDeviceName} placeholder="Enter Device Name" />
            <Button title="Finish" onPress={handleFinish} containerStyle={{ marginTop: "auto" }} />
          </View>
        )}
      </View>
      <FinishModal modalVisible={finishModal} setModalVisible={setShowFinishModal} onAddagainPress={onAddAgainPress} />
      <CameraModal visible={cameraVisible} onClose={() => setCameraVisible(false)} onScan={handleScan} />
    </PageWrapper>
  );
};

export default AddingDeviceSteps;


const styles = StyleSheet.create({
  container: {
    padding: DynamicSize(24),
  },
  icon: {
    height: DynamicSize(200),
    width: DynamicSize(280),
  },
  iconContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: DynamicSize(180),
  },
  galleryContainer: {
    backgroundColor: Colors.lilac,
    borderRadius: DynamicSize(50),
    alignSelf: "center",
  },
});