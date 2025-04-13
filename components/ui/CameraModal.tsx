import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import StyledText from "../StyledText";
import { DynamicSize } from "@/constants/helpers";
import { RFValue } from "react-native-responsive-fontsize";

type CameraModalProps = {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
};

const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  onClose,
  onScan,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (visible && !scanned) {
      setScanned(false);
      animateScanLine();
    }
  }, [visible, scanned]);

  const animateScanLine = () => {
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (!scanned && scanningResult.data) {
      console.log(scanningResult);
      setScanned(true);
      onScan(scanningResult.data);
      onClose();
    }
  };

  if (hasPermission === null) {
    return <StyledText>Requesting camera permission...</StyledText>;
  }
  if (hasPermission === false) {
    return <StyledText>No access to camera</StyledText>;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.middleContainer}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                {/* Scanning frame corners */}
                <View style={[styles.cornerTopLeft, styles.corner]} />
                <View style={[styles.cornerTopRight, styles.corner]} />
                <View style={[styles.cornerBottomLeft, styles.corner]} />
                <View style={[styles.cornerBottomRight, styles.corner]} />

                {/* Animated scanning line */}
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [
                        {
                          translateY: scanLineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [DynamicSize(10), DynamicSize(310)],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
        </CameraView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={DynamicSize(30)} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <StyledText textStyle={styles.headerText}>Scan QR Code</StyledText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  middleContainer: {
    flexDirection: "row",
    height: DynamicSize(320),
  },
  focusedContainer: {
    width: DynamicSize(250),
    height: DynamicSize(320),
  },
  headerContainer: {
    position: "absolute",
    top: DynamicSize(140),
    width: "100%",
    left: DynamicSize(24)
  },
  headerText: {
    color: "white",
    fontSize: DynamicSize(24),
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: DynamicSize(80),
    left: DynamicSize(20),
    zIndex: 1,
  },
  corner: {
    position: "absolute",
    width: DynamicSize(44),
    height: DynamicSize(44),
    borderColor: "white",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: DynamicSize(15)
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: DynamicSize(15)
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: DynamicSize(15)
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: DynamicSize(15)
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.white,
  },
});

export default CameraModal;
