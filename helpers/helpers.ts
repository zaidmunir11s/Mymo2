import React, { Ref } from "react";
import MapView from "react-native-maps";

type LocationObject = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const zoomIn = (
  mapRef: React.RefObject<MapView>,
  location: LocationObject,
  setLocation: (value: React.SetStateAction<null>) => void
) => {
  if (mapRef.current && location) {
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: location.latitudeDelta / 2,
      longitudeDelta: location.longitudeDelta / 2,
    };
    mapRef.current.animateToRegion(region, 300);
    setLocation(region);
  }
};

export const zoomOut = (
  mapRef: React.RefObject<MapView>,
  location: LocationObject,
  setLocation: (value: React.SetStateAction<null>) => void
) => {
  if (mapRef.current && location) {
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: location.latitudeDelta * 2,
      longitudeDelta: location.longitudeDelta * 2,
    };
    mapRef.current.animateToRegion(region, 300);
    setLocation(region);
  }
};

export const generateUniqueId = (): number => {
  const id = Math.floor(Math.random() * 100000);
  return id;
};
