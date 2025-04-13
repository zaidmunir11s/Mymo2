// import React, { useEffect, useRef, useState } from "react";
// import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
// import MapView, { UrlTile, Polygon, Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import GeofencingHeader from "../ui/GeofencingHeader";
// import { DynamicSize } from "@/constants/helpers";
// import Fab from "../ui/Fab";
// import GeofenceDetailCard from "../ui/GeofenceDetailCard";
// import {
//   BottomSheetModal,
//   BottomSheetModalProvider,
// } from "@gorhom/bottom-sheet";
// import { Colors } from "@/constants/Colors";
// import { zoomIn, zoomOut } from "@/helpers/helpers";
// import { useCreateGeofence, useUpdateGeofence } from "@/api/geofenceService";

// // Define geofence shape types
// type GeofenceShape = "Square" | "Circle" | "Triangle";

// // Define coordinates type
// type Coordinate = {
//   latitude: number;
//   longitude: number;
// };

// const defaultRegion = {
//   latitude: 24.7136,
//   longitude: 46.6753,
//   latitudeDelta: 0.1,
//   longitudeDelta: 0.1,
// };

// const Index = () => {
//   const route = useRoute();
//   const fenceData = route.params?.fence ? JSON.parse(route.params.fence) : null;
//   console.log("Received fence data:", fenceData);

//   const navigation = useNavigation();
//   const createMutation = useCreateGeofence();
//   const updateMutation = useUpdateGeofence(); // Add the update mutation
//   const sheetRef = useRef<BottomSheetModal>(null);
//   const mapRef = useRef<MapView>(null);
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState(defaultRegion);
//   const [selectedShape, setSelectedShape] = useState<GeofenceShape>("Square");
//   const [selectionName, setSelectionName] = useState<string>("");
//   const [selectedColor, setSelectedColor] = useState<string>("");
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [geofenceId, setGeofenceId] = useState<number | null>(null);

//   // Add state for geofence data
//   const [centerCoordinate, setCenterCoordinate] = useState<Coordinate | null>(
//     null
//   );
//   const [radius, setRadius] = useState<number>(100); // Default radius in meters for circle
//   const [squareSize, setSquareSize] = useState<number>(200); // Default size in meters for square
//   const [showGeofence, setShowGeofence] = useState<boolean>(false);
//   const [savedGeofences, setSavedGeofences] = useState<
//     Array<{
//       id: string;
//       name: string;
//       shape: GeofenceShape;
//       center: Coordinate;
//       radius?: number;
//       coordinates?: Coordinate[];
//       area?: number;
//     }>
//   >([]);

//   // Parse geofence area format from API
//   const parseGeofenceArea = (area: string) => {
//     if (!area || typeof area !== "string") return null;

//     if (area.startsWith("CIRCLE")) {
//       // Parse circle format: CIRCLE (lat lng, radius)
//       const match = area.match(/CIRCLE\s*\(([\d.-]+) ([\d.-]+), ([\d.]+)\)/);
//       if (match) {
//         return {
//           type: "Circle",
//           center: { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) },
//           size: parseFloat(match[3]),
//         };
//       }
//     } else if (area.startsWith("POLYGON")) {
//       // Parse polygon format: POLYGON ((lat1 lng1, lat2 lng2, ...))
//       const match = area.match(/POLYGON\s*\(\((.*?)\)\)/);
//       if (match) {
//         const coordinates = match[1].split(", ").map((coord) => {
//           const [lat, lng] = coord.split(" ").map(parseFloat);
//           return { latitude: lat, longitude: lng };
//         });

//         if (coordinates.length < 3) return null;

//         // Calculate center of polygon
//         const centerLat = coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / coordinates.length;
//         const centerLng = coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / coordinates.length;

//         return {
//           type: "Polygon",
//           center: { latitude: centerLat, longitude: centerLng },
//           coordinates,
//         };
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (fenceData) {
//       // We're editing an existing geofence
//       setIsEditMode(true);
//       setGeofenceId(fenceData.id ? parseInt(fenceData.id) : null);
//       setSelectionName(fenceData.name || "");
//       setSelectedColor(fenceData.color || "#FF5733");

//       // Parse the area string
//       const parsedArea = parseGeofenceArea(fenceData.area);
//       console.log("Parsed area:", parsedArea);

//       if (parsedArea) {
//         // Set center coordinate
//         setCenterCoordinate(parsedArea.center);

//         // Determine shape type and set appropriate values
//         if (fenceData.shape === "Circle" || parsedArea.type === "Circle") {
//           setSelectedShape("Circle");
//           setRadius(fenceData.size || parsedArea.size || 500);
//         } else {
//           // For polygons (Square/Triangle)
//           // Use the explicit shape from fenceData if available
//           const shapeType = fenceData.shape === "Polygon" ? "Square" :
//                            (fenceData.shape as GeofenceShape) || "Square";
//           setSelectedShape(shapeType);
//           setSquareSize(fenceData.size || 200);
//         }

//         // Show the geofence on the map
//         setShowGeofence(true);

//         // Center the map on the geofence
//         setLocation({
//           latitude: parsedArea.center.latitude,
//           longitude: parsedArea.center.longitude,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     // Ensure the sheet is presented only after mount
//     setTimeout(() => {
//       sheetRef.current?.present();
//     }, 500);
//   }, []);

//   // Calculate area based on shape and dimensions
//   const calculateArea = (shape: GeofenceShape, size: number): number => {
//     if (shape === "Circle") {
//       return Math.PI * Math.pow(size, 2); // πr²
//     } else if (shape === "Square") {
//       return Math.pow(size, 2); // side²
//     } else if (shape === "Triangle") {
//       // Approximating an equilateral triangle
//       return (Math.sqrt(3) / 4) * Math.pow(size, 2);
//     }
//     return 0;
//   };

//   // Helper function to calculate square coordinates
//   const calculateSquareCoordinates = (
//     center: Coordinate,
//     sizeInMeters: number
//   ): Coordinate[] => {
//     const latDelta = sizeInMeters / 111000; // Roughly 111km per degree of latitude
//     const lonDelta =
//       sizeInMeters / (111000 * Math.cos((center.latitude * Math.PI) / 180));

//     const halfLatDelta = latDelta / 2;
//     const halfLonDelta = lonDelta / 2;

//     return [
//       {
//         latitude: center.latitude - halfLatDelta,
//         longitude: center.longitude - halfLonDelta,
//       },
//       {
//         latitude: center.latitude - halfLatDelta,
//         longitude: center.longitude + halfLonDelta,
//       },
//       {
//         latitude: center.latitude + halfLatDelta,
//         longitude: center.longitude + halfLonDelta,
//       },
//       {
//         latitude: center.latitude + halfLatDelta,
//         longitude: center.longitude - halfLonDelta,
//       },
//     ];
//   };

//   // Helper function to calculate triangle coordinates
//   const calculateTriangleCoordinates = (
//     center: Coordinate,
//     sizeInMeters: number
//   ): Coordinate[] => {
//     const latDelta = sizeInMeters / 111000;
//     const lonDelta =
//       sizeInMeters / (111000 * Math.cos((center.latitude * Math.PI) / 180));

//     return [
//       { latitude: center.latitude - latDelta / 2, longitude: center.longitude },
//       {
//         latitude: center.latitude + latDelta / 2,
//         longitude: center.longitude - lonDelta / 2,
//       },
//       {
//         latitude: center.latitude + latDelta / 2,
//         longitude: center.longitude + lonDelta / 2,
//       },
//     ];
//   };

//   // Handle map press to set geofence center
//   const handleMapPress = (event) => {
//     const coordinate = event.nativeEvent.coordinate;
//     setCenterCoordinate(coordinate);
//     setShowGeofence(true);
//   };

//   // Update fence size based on slider
//   const handleSizeChange = (value: number) => {
//     if (selectedShape === "Circle") {
//       setRadius(value);
//     } else {
//       setSquareSize(value);
//     }
//   };

//   const saveGeofence = async () => {
//     if (!centerCoordinate || !selectionName) return;

//     let area = "";

//     if (selectedShape === "Circle") {
//       // Format for Circle: "CIRCLE (lat lng, radius)"
//       area = `CIRCLE (${centerCoordinate.latitude} ${centerCoordinate.longitude}, ${radius})`;
//     } else if (selectedShape === "Square" || selectedShape === "Triangle") {
//       // Format for Polygon: "POLYGON ((lat1 lng1, lat2 lng2, lat3 lng3, ...))"
//       const coordinates =
//         selectedShape === "Square"
//           ? calculateSquareCoordinates(centerCoordinate, squareSize)
//           : calculateTriangleCoordinates(centerCoordinate, squareSize);
//       const polygonCoords = coordinates
//         .map((coord) => `${coord.latitude} ${coord.longitude}`)
//         .join(", ");
//       area = `POLYGON ((${polygonCoords}))`;
//     }

//     // Set color based on shape if not already set
//     const defaultColors = {
//       Circle: Colors.purple_20,
//       Square: "rgba(76, 175, 80, 0.3)",
//       Triangle: "rgba(0, 122, 255, 0.8)"
//     };

//     const color = selectedColor || defaultColors[selectedShape];

//     // Create the geofence object in Traccar API format
//     const geofence = {
//       id: isEditMode && geofenceId ? geofenceId : 0, // Use existing ID if editing
//       name: selectionName,
//       description: `A ${selectedShape} geofence`,
//       area: area,
//       calendarId: 0,
//       attributes: { color, exactShape: selectedShape },
//     };

//     if (isEditMode && geofenceId) {
//       // Update existing geofence
//       updateMutation.mutate(geofence, {
//         onSuccess: (updatedGeofence) => {
//           // Success message
//           Alert.alert(
//             "Success",
//             `${selectedShape} geofence "${selectionName}" has been updated.`,
//             [{ text: "OK", onPress: () => navigation.goBack() }]
//           );
//         },
//         onError: (error) => {
//           console.error("Error updating geofence:", error);
//           Alert.alert("Error", "Failed to update geofence.");
//         }
//       });
//     } else {
//       // Create new geofence
//       createMutation.mutate(geofence, {
//         onSuccess: (createdGeofence) => {
//           // Success message
//           Alert.alert(
//             "Success",
//             `${selectedShape} geofence "${selectionName}" has been created.`,
//             [{ text: "OK", onPress: () => navigation.goBack() }]
//           );
//         },
//         onError: (error) => {
//           console.error("Error saving geofence:", error);
//           Alert.alert("Error", "Failed to save geofence to Traccar.");
//         }
//       });
//     }
//   };

//   const getCurrentSizeValue = () => {
//     return selectedShape === "Circle" ? radius : squareSize;
//   };

//   // Get min/max values for slider based on shape
//   const getSliderMinMax = () => {
//     if (selectedShape === "Circle") {
//       return { min: 50, max: 500 };
//     } else if (selectedShape === "Square") {
//       return { min: 100, max: 1000 };
//     } else if (selectedShape === "Triangle") {
//       return { min: 100, max: 1000 };
//     }
//     return { min: 50, max: 500 };
//   };

//   // Get slider units label based on shape
//   const getSliderUnits = () => {
//     return selectedShape === "Circle" ? "radius" : "side length";
//   };

//   return (
//     <BottomSheetModalProvider>
//       <View style={styles.container}>
//         <GeofencingHeader style={styles.absolute_header} showBackIcon />
//         {loading ? (
//           <View style={styles.loader}>
//             <ActivityIndicator size="large" color="#0000ff" />
//           </View>
//         ) : (
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             initialRegion={location}
//             onPress={handleMapPress}
//           >
//             <UrlTile
//               urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//               zIndex={0}
//             />

//             {/* Display preview geofence */}
//             {showGeofence && centerCoordinate && (
//               <>
//                 {selectedShape === "Circle" && (
//                   <Circle
//                     center={centerCoordinate}
//                     radius={radius}
//                     strokeWidth={2}
//                     strokeColor={Colors.tint}
//                     fillColor={selectedColor || Colors.purple_20}
//                   />
//                 )}

//                 {selectedShape === "Square" && (
//                   <Polygon
//                     coordinates={calculateSquareCoordinates(
//                       centerCoordinate,
//                       squareSize
//                     )}
//                     strokeWidth={2}
//                     strokeColor={Colors.lighter_blue_100}
//                     fillColor={selectedColor || Colors.lighter_blue_20}
//                   />
//                 )}

//                 {selectedShape === "Triangle" && (
//                   <Polygon
//                     coordinates={calculateTriangleCoordinates(
//                       centerCoordinate,
//                       squareSize
//                     )}
//                     strokeWidth={2}
//                     strokeColor="rgba(0, 122, 255, 0.8)"
//                     fillColor={selectedColor || "rgba(0, 122, 255, 0.3)"}
//                   />
//                 )}

//                 <Marker coordinate={centerCoordinate} />
//               </>
//             )}

//             {/* Display saved geofences */}
//             {savedGeofences.map((geofence) => (
//               <React.Fragment key={geofence.id}>
//                 {geofence.shape === "Circle" && geofence.radius && (
//                   <Circle
//                     center={geofence.center}
//                     radius={geofence.radius}
//                     strokeWidth={2}
//                     strokeColor="rgba(76, 175, 80, 0.8)"
//                     fillColor="rgba(76, 175, 80, 0.3)"
//                   />
//                 )}

//                 {(geofence.shape === "Square" ||
//                   geofence.shape === "Triangle") &&
//                   geofence.coordinates && (
//                     <Polygon
//                       coordinates={geofence.coordinates}
//                       strokeWidth={2}
//                       strokeColor="rgba(76, 175, 80, 0.8)"
//                       fillColor="rgba(76, 175, 80, 0.3)"
//                     />
//                   )}

//                 <Marker
//                   coordinate={geofence.center}
//                   title={geofence.name}
//                   description={`${geofence.shape} Geofence - Area: ${geofence.area} sq m`}
//                 />
//               </React.Fragment>
//             ))}
//           </MapView>
//         )}

//         <Fab
//           onZoomIn={() => zoomIn(mapRef, location, setLocation)}
//           onZoomOut={() => zoomOut(mapRef, location, setLocation)}
//           style={{ bottom: DynamicSize(390) }}
//         />

//         <GeofenceDetailCard
//           reference={sheetRef}
//           onSelectShape={setSelectedShape}
//           selectedShape={selectedShape}
//           selectionName={selectionName}
//           onNameChange={setSelectionName}
//           onSave={saveGeofence}
//           showSizeSlider={showGeofence && !!centerCoordinate}
//           sizeValue={getCurrentSizeValue()}
//           onSizeChange={handleSizeChange}
//           sliderMinMax={getSliderMinMax()}
//           sliderUnits={getSliderUnits()}
//           calculatedArea={calculateArea(selectedShape, getCurrentSizeValue())}
//           isEditMode={isEditMode}
//         />
//       </View>
//     </BottomSheetModalProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   absolute_header: {
//     position: "absolute",
//     top: DynamicSize(10),
//     left: DynamicSize(24),
//     zIndex: 1,
//     width: "88%",
//     gap: DynamicSize(10),
//   },
// });

// export default Index;

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, {
  UrlTile,
  Polygon,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import GeofencingHeader from "../ui/GeofencingHeader";
import { DynamicSize } from "@/constants/helpers";
import Fab from "../ui/Fab";
import GeofenceDetailCard from "../ui/GeofenceDetailCard";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { zoomIn, zoomOut } from "@/helpers/helpers";
import { useCreateGeofence, useUpdateGeofence } from "@/api/geofenceService";

// Define geofence shape types
type GeofenceShape = "Square" | "Circle" | "Triangle";

// Define coordinates type
type Coordinate = {
  latitude: number;
  longitude: number;
};

const defaultRegion = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const Index = () => {
  const route = useRoute();
  const fenceData = route.params?.fence ? JSON.parse(route.params.fence) : null;
  console.log("Received fence data:", fenceData);

  const navigation = useNavigation();
  const createMutation = useCreateGeofence();
  const updateMutation = useUpdateGeofence(); // Add the update mutation
  const sheetRef = useRef<BottomSheetModal>(null);
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(defaultRegion);
  const [selectedShape, setSelectedShape] = useState<GeofenceShape>("Square");
  const [selectionName, setSelectionName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [geofenceId, setGeofenceId] = useState<number | null>(null);

  // Add state for geofence data
  const [centerCoordinate, setCenterCoordinate] = useState<Coordinate | null>(
    null
  );
  const [radius, setRadius] = useState<number>(100); // Default radius in meters for circle
  const [squareSize, setSquareSize] = useState<number>(200); // Default size in meters for square
  const [showGeofence, setShowGeofence] = useState<boolean>(false);
  const [savedGeofences, setSavedGeofences] = useState<
    Array<{
      id: string;
      name: string;
      shape: GeofenceShape;
      center: Coordinate;
      radius?: number;
      coordinates?: Coordinate[];
      area?: number;
    }>
  >([]);

  // Parse geofence area format from API
  const parseGeofenceArea = (area: string) => {
    if (!area || typeof area !== "string") return null;

    if (area.startsWith("CIRCLE")) {
      // Parse circle format: CIRCLE (lat lng, radius)
      const match = area.match(/CIRCLE\s*\(([\d.-]+) ([\d.-]+), ([\d.]+)\)/);
      if (match) {
        return {
          type: "Circle",
          center: {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
          },
          size: parseFloat(match[3]),
        };
      }
    } else if (area.startsWith("POLYGON")) {
      // Parse polygon format: POLYGON ((lat1 lng1, lat2 lng2, ...))
      const match = area.match(/POLYGON\s*\(\((.*?)\)\)/);
      if (match) {
        const coordinates = match[1].split(", ").map((coord) => {
          const [lat, lng] = coord.split(" ").map(parseFloat);
          return { latitude: lat, longitude: lng };
        });

        if (coordinates.length < 3) return null;

        // Calculate center of polygon
        const centerLat =
          coordinates.reduce((sum, coord) => sum + coord.latitude, 0) /
          coordinates.length;
        const centerLng =
          coordinates.reduce((sum, coord) => sum + coord.longitude, 0) /
          coordinates.length;

        return {
          type: "Polygon",
          center: { latitude: centerLat, longitude: centerLng },
          coordinates,
        };
      }
    }
    return null;
  };

  useEffect(() => {
    if (fenceData) {
      // We're editing an existing geofence
      setIsEditMode(true);
      setGeofenceId(fenceData.id ? parseInt(fenceData.id) : null);
      setSelectionName(fenceData.name || "");
      setSelectedColor(fenceData.color || "#FF5733");

      // Check for exactShape in attributes
      const exactShape = fenceData.attributes?.exactShape;

      // Parse the area string
      const parsedArea = parseGeofenceArea(fenceData.area);
      console.log("Parsed area:", parsedArea);

      if (parsedArea) {
        // Set center coordinate
        setCenterCoordinate(parsedArea.center);

        // Determine shape type using exactShape or fallback to parsing
        if (
          exactShape &&
          ["Circle", "Square", "Triangle"].includes(exactShape)
        ) {
          setSelectedShape(exactShape as GeofenceShape);
        } else if (
          fenceData.shape === "Circle" ||
          parsedArea.type === "Circle"
        ) {
          setSelectedShape("Circle");
        } else {
          // For polygons (Square/Triangle) when exactShape is not available
          const shapeType =
            fenceData.shape === "Polygon"
              ? "Square"
              : (fenceData.shape as GeofenceShape) || "Square";
          setSelectedShape(shapeType);
        }

        // Set appropriate size based on the shape
        if (selectedShape === "Circle") {
          setRadius(fenceData.size || parsedArea.size || 500);
        } else {
          setSquareSize(fenceData.size || 200);
        }

        // Show the geofence on the map
        setShowGeofence(true);

        // Center the map on the geofence
        setLocation({
          latitude: parsedArea.center.latitude,
          longitude: parsedArea.center.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    }
  }, []);

  useEffect(() => {
    // Ensure the sheet is presented only after mount
    setTimeout(() => {
      sheetRef.current?.present();
    }, 500);
  }, []);

  // Calculate area based on shape and dimensions
  const calculateArea = (shape: GeofenceShape, size: number): number => {
    if (shape === "Circle") {
      return Math.PI * Math.pow(size, 2); // πr²
    } else if (shape === "Square") {
      return Math.pow(size, 2); // side²
    } else if (shape === "Triangle") {
      // Approximating an equilateral triangle
      return (Math.sqrt(3) / 4) * Math.pow(size, 2);
    }
    return 0;
  };

  // Helper function to calculate square coordinates
  const calculateSquareCoordinates = (
    center: Coordinate,
    sizeInMeters: number
  ): Coordinate[] => {
    const latDelta = sizeInMeters / 111000; // Roughly 111km per degree of latitude
    const lonDelta =
      sizeInMeters / (111000 * Math.cos((center.latitude * Math.PI) / 180));

    const halfLatDelta = latDelta / 2;
    const halfLonDelta = lonDelta / 2;

    return [
      {
        latitude: center.latitude - halfLatDelta,
        longitude: center.longitude - halfLonDelta,
      },
      {
        latitude: center.latitude - halfLatDelta,
        longitude: center.longitude + halfLonDelta,
      },
      {
        latitude: center.latitude + halfLatDelta,
        longitude: center.longitude + halfLonDelta,
      },
      {
        latitude: center.latitude + halfLatDelta,
        longitude: center.longitude - halfLonDelta,
      },
    ];
  };

  // Helper function to calculate triangle coordinates
  const calculateTriangleCoordinates = (
    center: Coordinate,
    sizeInMeters: number
  ): Coordinate[] => {
    const latDelta = sizeInMeters / 111000;
    const lonDelta =
      sizeInMeters / (111000 * Math.cos((center.latitude * Math.PI) / 180));

    return [
      { latitude: center.latitude - latDelta / 2, longitude: center.longitude },
      {
        latitude: center.latitude + latDelta / 2,
        longitude: center.longitude - lonDelta / 2,
      },
      {
        latitude: center.latitude + latDelta / 2,
        longitude: center.longitude + lonDelta / 2,
      },
    ];
  };

  // Handle map press to set geofence center
  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setCenterCoordinate(coordinate);
    setShowGeofence(true);
  };

  // Update fence size based on slider
  const handleSizeChange = (value: number) => {
    if (selectedShape === "Circle") {
      setRadius(value);
    } else {
      setSquareSize(value);
    }
  };

  const saveGeofence = async () => {
    if (!centerCoordinate || !selectionName) return;

    let area = "";

    if (selectedShape === "Circle") {
      // Format for Circle: "CIRCLE (lat lng, radius)"
      area = `CIRCLE (${centerCoordinate.latitude} ${centerCoordinate.longitude}, ${radius})`;
    } else if (selectedShape === "Square" || selectedShape === "Triangle") {
      // Format for Polygon: "POLYGON ((lat1 lng1, lat2 lng2, lat3 lng3, ...))"
      const coordinates =
        selectedShape === "Square"
          ? calculateSquareCoordinates(centerCoordinate, squareSize)
          : calculateTriangleCoordinates(centerCoordinate, squareSize);
      const polygonCoords = coordinates
        .map((coord) => `${coord.latitude} ${coord.longitude}`)
        .join(", ");
      area = `POLYGON ((${polygonCoords}))`;
    }

    // Set color based on shape if not already set
    const defaultColors = {
      Circle: Colors.lighter_blue,
      Square: "#4CAF50",
      Triangle: "#007AFF",
    };

    const color = selectedColor || defaultColors[selectedShape];

    // Create the geofence object in Traccar API format
    const geofence = {
      id: isEditMode && geofenceId ? geofenceId : 0, // Use existing ID if editing
      name: selectionName,
      description: `A ${selectedShape} geofence`,
      area: area,
      calendarId: 0,
      attributes: {
        color,
        exactShape: selectedShape, // Add the exact shape type in attributes
      },
    };

    if (isEditMode && geofenceId) {
      // Update existing geofence
      updateMutation.mutate(geofence, {
        onSuccess: (updatedGeofence) => {
          // Success message
          Alert.alert(
            "Success",
            `${selectedShape} geofence "${selectionName}" has been updated.`,
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        },
        onError: (error) => {
          console.error("Error updating geofence:", error);
          Alert.alert("Error", "Failed to update geofence.");
        },
      });
    } else {
      // Create new geofence
      createMutation.mutate(geofence, {
        onSuccess: (createdGeofence) => {
          // Success message
          Alert.alert(
            "Success",
            `${selectedShape} geofence "${selectionName}" has been created.`,
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        },
        onError: (error) => {
          console.error("Error saving geofence:", error);
          Alert.alert("Error", "Failed to save geofence to Traccar.");
        },
      });
    }
  };

  const getCurrentSizeValue = () => {
    return selectedShape === "Circle" ? radius : squareSize;
  };

  // Get min/max values for slider based on shape
  const getSliderMinMax = () => {
    if (selectedShape === "Circle") {
      return { min: 50, max: 500 };
    } else if (selectedShape === "Square") {
      return { min: 100, max: 1000 };
    } else if (selectedShape === "Triangle") {
      return { min: 100, max: 1000 };
    }
    return { min: 50, max: 500 };
  };

  // Get slider units label based on shape
  const getSliderUnits = () => {
    return selectedShape === "Circle" ? "radius" : "side length";
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <GeofencingHeader style={styles.absolute_header} showBackIcon />
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location}
            onPress={handleMapPress}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              zIndex={0}
            />

            {/* Display preview geofence */}
            {showGeofence && centerCoordinate && (
              <>
                {selectedShape === "Circle" && (
                  <Circle
                    center={centerCoordinate}
                    radius={radius}
                    strokeWidth={2}
                    strokeColor={Colors.tint}
                    fillColor={selectedColor || Colors.purple_20}
                  />
                )}

                {selectedShape === "Square" && (
                  <Polygon
                    coordinates={calculateSquareCoordinates(
                      centerCoordinate,
                      squareSize
                    )}
                    strokeWidth={2}
                    strokeColor={Colors.lighter_blue_100}
                    fillColor={selectedColor || Colors.lighter_blue_20}
                  />
                )}

                {selectedShape === "Triangle" && (
                  <Polygon
                    coordinates={calculateTriangleCoordinates(
                      centerCoordinate,
                      squareSize
                    )}
                    strokeWidth={2}
                    strokeColor="rgba(0, 122, 255, 0.8)"
                    fillColor={selectedColor || "rgba(0, 122, 255, 0.3)"}
                  />
                )}

                <Marker coordinate={centerCoordinate} />
              </>
            )}

            {/* Display saved geofences */}
            {savedGeofences.map((geofence) => (
              <React.Fragment key={geofence.id}>
                {geofence.shape === "Circle" && geofence.radius && (
                  <Circle
                    center={geofence.center}
                    radius={geofence.radius}
                    strokeWidth={2}
                    strokeColor="rgba(76, 175, 80, 0.8)"
                    fillColor="rgba(76, 175, 80, 0.3)"
                  />
                )}

                {(geofence.shape === "Square" ||
                  geofence.shape === "Triangle") &&
                  geofence.coordinates && (
                    <Polygon
                      coordinates={geofence.coordinates}
                      strokeWidth={2}
                      strokeColor="rgba(76, 175, 80, 0.8)"
                      fillColor="rgba(76, 175, 80, 0.3)"
                    />
                  )}

                <Marker
                  coordinate={geofence.center}
                  title={geofence.name}
                  description={`${geofence.shape} Geofence - Area: ${geofence.area} sq m`}
                />
              </React.Fragment>
            ))}
          </MapView>
        )}

        <Fab
          onZoomIn={() => zoomIn(mapRef, location, setLocation)}
          onZoomOut={() => zoomOut(mapRef, location, setLocation)}
          style={{ bottom: DynamicSize(390) }}
        />

        <GeofenceDetailCard
          reference={sheetRef}
          onSelectShape={setSelectedShape}
          selectedShape={selectedShape}
          selectionName={selectionName}
          onNameChange={setSelectionName}
          onSave={saveGeofence}
          showSizeSlider={showGeofence && !!centerCoordinate}
          sizeValue={getCurrentSizeValue()}
          onSizeChange={handleSizeChange}
          sliderMinMax={getSliderMinMax()}
          sliderUnits={getSliderUnits()}
          calculatedArea={calculateArea(selectedShape, getCurrentSizeValue())}
          isEditMode={isEditMode}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute_header: {
    position: "absolute",
    top: DynamicSize(10),
    left: DynamicSize(24),
    zIndex: 1,
    width: "88%",
    gap: DynamicSize(10),
  },
});

export default Index;
