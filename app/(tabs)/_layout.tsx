import { Redirect, router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Platform, View } from "react-native";
import { Image } from "expo-image";
import Styles from "@/constants/Styles";
import { DynamicSize } from "@/constants/helpers";
import { Colors } from "@/constants/Colors";
import { Svg, Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { checkSession } from "@/api/authService";

export default function TabLayout() {
  const { width } = Dimensions.get("window");
  const tabBarHeight =
    Platform.OS === "ios" ? DynamicSize(94) : DynamicSize(70);
  const cutoutRadius = DynamicSize(35); // Adjust based on the button size
  const cutoutCenterX = width / 2;
  const cutoutY = DynamicSize(15); // Adjust how deep the cutout is

  const Bg = () => {
    return (
      <Svg
        width={width}
        height={tabBarHeight}
        viewBox={`0 0 ${width} ${tabBarHeight}`}
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d={`
            M0,0 
            H${cutoutCenterX - cutoutRadius} 
            Q${cutoutCenterX} ${cutoutY} ${cutoutCenterX + cutoutRadius} 0 
            H${width} 
            V${tabBarHeight} 
            H0 
            Z
          `}
          fill="white"
        />
      </Svg>
    );
  };

  // const isAuthenticated = useStore.getState().isAuthenticated();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await checkSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        // tabBarBackground: () => <Bg />,
        tabBarStyle: {
          position: "absolute",
          height: tabBarHeight,
          paddingBottom: Platform.OS === "ios" ? 20 : 0,
          borderTopLeftRadius: DynamicSize(20),
          borderTopRightRadius: DynamicSize(20),
          elevation: 10,
          boxShadow: "0px -4px 15px 2px rgba(41,41,55,0.23)",
          zIndex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tracking",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/marker.svg")}
              tintColor={color}
              style={[Styles.icon_24_res]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="geofencing"
        options={{
          title: "Geofencing",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={DynamicSize(24)} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: Colors.tint,
                width: 56,
                height: 56,
                borderRadius: 28,
                marginBottom: DynamicSize(32),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="add" size={32} color="white" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            router.navigate("/(public)/AddDevice/addDevice");
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/notification-bing.svg")}
              tintColor={color}
              style={[Styles.icon_24_res]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/profile.svg")}
              tintColor={color}
              style={[Styles.icon_24_res]}
            />
          ),
        }}
      />
    </Tabs>
  );
}
