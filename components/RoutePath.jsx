import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Polyline } from 'react-native-maps';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';
import { Colors } from '@/constants/Colors';

/**
 * Component to display a device's route path on the map
 * 
 * @param {Object} props Component props
 * @param {number} props.deviceId The device ID to fetch positions for
 * @param {string} props.fromDate Start date in ISO format
 * @param {string} props.toDate End date in ISO format
 * @param {boolean} props.visible Whether the route path should be visible
 */
const RoutePath = ({ deviceId, fromDate, toDate, visible = true }) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutePath = async () => {
      if (!deviceId || !fromDate || !toDate || !visible) {
        setRouteCoordinates([]);
        return;
      }

      setLoading(true);
      try {
        const credentialsString = await AsyncStorage.getItem("credentials");

        if (!credentialsString) {
          console.error("No credentials found in AsyncStorage");
          return;
        }

        const { email, password } = JSON.parse(credentialsString);
        const token = Buffer.from(`${email}:${password}`, "utf8").toString("base64");

        // Format the API request to match the web app's request
        const query = new URLSearchParams({ 
          deviceId, 
          from: fromDate, 
          to: toDate 
        }).toString();
        
        const response = await fetch(`${API_URL}/positions?${query}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${token}`,
          },
        });

        if (response.ok) {
          const positions = await response.json();
          if (positions && positions.length > 0) {
            // Transform positions into route coordinates
            const coordinates = positions.map(pos => ({
              latitude: pos.latitude,
              longitude: pos.longitude,
            }));
            setRouteCoordinates(coordinates);
          } else {
            setRouteCoordinates([]);
          }
        } else {
          console.error("Failed to fetch positions:", await response.text());
          setRouteCoordinates([]);
        }
      } catch (error) {
        console.error("Error fetching route path:", error);
        setRouteCoordinates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutePath();
  }, [deviceId, fromDate, toDate, visible]);

  if (!visible || routeCoordinates.length === 0) {
    return null;
  }

  return (
    <Polyline
      coordinates={routeCoordinates}
      strokeWidth={4}
      strokeColor={Colors.tint}
      lineDashPattern={[0]}
    />
  );
};

export default RoutePath;