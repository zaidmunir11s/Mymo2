import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Switch, Text } from "react-native";
import StyledText from "../StyledText";
import { router } from "expo-router";
import { Image } from "expo-image";
import ColorPicker, {
  Panel1,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

// Define types
type Coordinate = {
  latitude: number;
  longitude: number;
};

type FenceData = {
  id: string;
  area: string;
  center: Coordinate;
  name: string;
  shape: string;
  size: number;
  color: string;
  enabled: boolean;
};

interface GeofencesDetailsProps {
  reference: React.RefObject<BottomSheetModal>;
  fences: FenceData[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onFencePress?: (fence: FenceData) => void;
}

const GeofencesDetails: React.FC<GeofencesDetailsProps> = ({
  reference,
  fences,
  onDelete,
  onToggle,
  onColorChange,
  onFencePress,
}) => {
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [selectedFenceForColor, setSelectedFenceForColor] =
    useState<FenceData | null>(null);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");

  useEffect(() => {
    if (fences.length > 0 && !isColorPickerVisible) {
      reference.current?.present();
    }
  }, [fences]);

  const handleColorSelect = ({ hex }: { hex: string }) => {
    if (selectedFenceForColor) {
      onColorChange(selectedFenceForColor.id, hex);
    }
    setIsColorPickerVisible(false);
    reference.current?.snapToIndex(0);
  };

  const handleCancelColor = () => {
    setIsColorPickerVisible(false);
    reference.current?.snapToIndex(0);
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={reference}
        snapPoints={[DynamicSize(400), DynamicSize(630)]} // Two snap points
        handleStyle={Styles.dragHandleContainer}
        handleIndicatorStyle={Styles.longHandle}
        backgroundStyle={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
      >
        <BottomSheetScrollView
          style={
            isColorPickerVisible
              ? styles.scrollView
              : { maxHeight: DynamicSize(350) }
          }
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {isColorPickerVisible ? (
            <View style={styles.colorPickerContainer}>
              <Text style={styles.pickerTitle}>
                Editing {selectedFenceForColor?.name}
              </Text>
              <ColorPicker
                style={styles.colorPicker}
                value={selectedColor}
                onComplete={handleColorSelect}
                boundedThumb
              >
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
              </ColorPicker>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelColor}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            fences.map((fence) => (
              <TouchableOpacity
                key={fence.id}
                style={styles.fenceRow}
                onPress={() => onFencePress && onFencePress(fence)}
              >
                <View style={[Styles.row, Styles.gap_10]}>
                  <Switch
                    value={fence.enabled}
                    onValueChange={() => onToggle(fence.id)}
                    trackColor={{ false: Colors.grey_50, true: Colors.tint }}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.75 }] }}
                  />
                  <StyledText style={styles.text}>{fence.name}</StyledText>
                </View>

                <View style={[Styles.row, Styles.gap_10]}>
                  <TouchableOpacity
                    style={[styles.colorBar, { backgroundColor: fence.color }]}
                    onPress={() => {
                      setSelectedFenceForColor(fence);
                      setSelectedColor(fence.color);
                      setIsColorPickerVisible(true);
                      reference.current?.snapToIndex(1);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      router.navigate({
                        pathname: "/(auth)/AddGeofence",
                        params: { fence: JSON.stringify(fence) },
                      })
                    }
                  >
                    <Image
                      source={require("@/assets/icons/edit.svg")}
                      style={[Styles.icon_20_res]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(fence.id)}>
                    <Image
                      source={require("@/assets/icons/trash.svg")}
                      style={[Styles.icon_20_res]}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // maxHeight: DynamicSize(350),
    flex: 1,
  },
  container: {
    padding: DynamicSize(22),
    paddingBottom: DynamicSize(100),
    gap: DynamicSize(12),
    paddingTop: DynamicSize(5),
  },
  fenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: DynamicSize(10),
    boxShadow: "0px 0px 6px 0px rgba(0,0,0,0.25)",
    padding: DynamicSize(10),
    borderRadius: DynamicSize(12),
  },
  text: {
    flex: 1,
    marginLeft: DynamicSize(10),
  },
  colorBar: {
    width: DynamicSize(63),
    height: DynamicSize(20),
    borderRadius: DynamicSize(5),
    marginRight: DynamicSize(20),
  },
  colorPickerContainer: {
    padding: DynamicSize(20),
    alignItems: "center",
    paddingTop: DynamicSize(0),
  },
  pickerTitle: {
    fontSize: DynamicSize(18),
    fontWeight: "bold",
    marginBottom: DynamicSize(15),
  },
  colorPicker: {
    width: "100%",
    marginBottom: DynamicSize(20),
  },
  cancelButton: {
    padding: DynamicSize(10),
    backgroundColor: Colors.grey_50,
    borderRadius: DynamicSize(5),
    width: "100%",
    alignItems: "center",
    marginBottom: DynamicSize(10),
  },
  buttonText: {
    color: Colors.black,
    fontWeight: "bold",
  },
});

export default GeofencesDetails;
