import { Colors } from "@/constants/Colors";
import { DynamicSize } from "@/constants/helpers";
import Styles from "@/constants/Styles";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { ForwardedRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "../StyledText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "./Input";
import Button from "./Button";
import Slider from "@react-native-community/slider"; // Make sure to install this package

type GeofenceShape = "Square" | "Circle" | "Triangle";

type Props = {
  reference: ForwardedRef<BottomSheetModal>;
  onSelectShape: (shape: GeofenceShape) => void;
  selectedShape: GeofenceShape;
  selectionName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  // New props for size slider
  showSizeSlider?: boolean;
  sizeValue?: number;
  onSizeChange?: (value: number) => void;
  sliderMinMax?: { min: number; max: number };
  sliderUnits?: string;
  calculatedArea?: number;
  isEditMode?: boolean;
};

const shapes = [
  {
    name: "Square" as GeofenceShape,
    id: 1,
  },
  {
    name: "Circle" as GeofenceShape,
    id: 2,
  },
  {
    name: "Triangle" as GeofenceShape,
    id: 3,
  },
];

const GeofenceDetailCard = ({ 
  reference, 
  onSelectShape, 
  selectedShape,
  selectionName,
  onNameChange,
  onSave,
  showSizeSlider = false,
  sizeValue = 100,
  onSizeChange = () => {},
  sliderMinMax = { min: 50, max: 500 },
  sliderUnits = "meters",
  calculatedArea = 0,
  isEditMode
}: Props) => {
  // Adjust snap points based on whether slider is showing
  const snapPoints = React.useMemo(() => 
    [DynamicSize(showSizeSlider ? 520 : 370)], 
    [showSizeSlider]
  );

  // Find shape object that matches the selected shape
  const selectedShapeObj = shapes.find(shape => shape.name === selectedShape) || shapes[0];

  // Format area for display
  const formattedArea = calculatedArea.toFixed(2);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={reference}
        snapPoints={snapPoints}
        handleStyle={Styles.dragHandleContainer}
        handleIndicatorStyle={Styles.longHandle}
        backgroundStyle={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
        enablePanDownToClose={false} // Prevent closing by swiping down
      >
        <BottomSheetScrollView
          contentContainerStyle={[styles.help]}
        >
          <StyledText
            fontSize={DynamicSize(24)}
            textStyle={{ fontWeight: "600" }}
            color={Colors.grey_100}
          >
            Add Geofence
          </StyledText>
          <View style={styles.innerContainer}>
            <StyledText type="body" color={Colors.grey_100}>
              Tap on the map to place your fence
            </StyledText>
            <View style={[Styles.row, styles.paddingContainer]}>
              {shapes.map((item) => (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    Styles.items_center,
                    { backgroundColor: selectedShapeObj.id === item.id ? Colors.lilac : Colors.white },
                  ]}
                  key={item.id}
                  onPress={() => onSelectShape(item.name)}
                >
                  <MaterialCommunityIcons
                    name={
                      item.name === "Square"
                        ? "square-outline"
                        : item.name === "Circle"
                        ? "circle-outline"
                        : item.name === "Triangle"
                        ? "triangle-outline"
                        : undefined
                    }
                    size={DynamicSize(20)}
                    color={Colors.tint}
                  />
                  <StyledText type="body" color={Colors.grey_100}>
                    {item.name}
                  </StyledText>
                </TouchableOpacity>
              ))}
            </View>
            
            <Input 
              label="Geofence Name" 
              placeholder="Enter Geofence Name" 
              value={selectionName} 
              onChangeText={onNameChange}
            />
            
            {showSizeSlider && (
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabelContainer}>
                  <StyledText type="body" color={Colors.grey_100}>
                    Adjust {selectedShape} {sliderUnits}
                  </StyledText>
                  <StyledText type="body" color={Colors.tint}>
                    {sizeValue} m
                  </StyledText>
                </View>
                
                <Slider
                  style={styles.slider}
                  minimumValue={sliderMinMax.min}
                  maximumValue={sliderMinMax.max}
                  value={sizeValue}
                  onValueChange={onSizeChange}
                  minimumTrackTintColor={Colors.tint}
                  maximumTrackTintColor={Colors.grey_30}
                  step={5}
                />
                
                <View style={styles.areaContainer}>
                  <StyledText type="body" color={Colors.grey_100}>
                    Estimated Area:
                  </StyledText>
                  <StyledText type="body" color={Colors.tint} textStyle={{fontWeight: '600'}}>
                    {formattedArea} m²
                  </StyledText>
                </View>
              </View>
            )}
            
            <Button 
              title={showSizeSlider ? `${isEditMode ? 'Update' : 'Create'} Geofence` : 'Tap Map & Name Fence'} 
              onPress={onSave}
              disabled={!selectionName || !showSizeSlider}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  help: {
    paddingHorizontal: DynamicSize(24),
    paddingBottom: DynamicSize(16),
    gap: DynamicSize(24),
  },
  innerContainer: {
    gap: DynamicSize(16),
  },
  chip: {
    flex: 1,
    borderRadius: DynamicSize(8),
    flexDirection: "row",
    gap: DynamicSize(6),
    paddingVertical: DynamicSize(12),
  },
  paddingContainer: {
    padding: DynamicSize(3),
    borderWidth: 1,
    borderColor: Colors.grey_10,
    borderRadius: DynamicSize(8)
  },
  sliderContainer: {
    gap: DynamicSize(8),
    marginTop: DynamicSize(8),
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: DynamicSize(40),
  },
  areaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.grey_10,
    padding: DynamicSize(12),
    borderRadius: DynamicSize(8),
  },
});

export default GeofenceDetailCard;