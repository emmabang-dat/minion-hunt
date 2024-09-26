import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { getGruLocation } from "../firebase/firestoreService";

interface Location {
  latitude: number;
  longitude: number;
  stadie: number;
}

interface CircleType {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
}

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function generateNewCircle(
  C_prev_lat: number,
  C_prev_lng: number,
  R_prev: number,
  H_lat: number,
  H_lng: number
): CircleType {
  const reductionFactor = 0.8;
  const R_new = R_prev * reductionFactor;

  const bufferDistance = Math.max(R_new * 0.04, 40); // Minimum 5% or 50 meters buffer
  const maxCenterOffset = R_prev - R_new - bufferDistance; // Adjust for buffer

  let N_lat: number, N_lng: number;

  while (true) {
    const theta = Math.random() * 2 * Math.PI;
    const d_center = Math.random() * maxCenterOffset;
    const offsetX_center = d_center * Math.cos(theta);
    const offsetY_center = d_center * Math.sin(theta);

    const deltaLat_center = offsetY_center / 111320;
    const deltaLng_center =
      offsetX_center / (111320 * Math.cos(deg2rad(C_prev_lat)));

    N_lat = C_prev_lat + deltaLat_center;
    N_lng = C_prev_lng + deltaLng_center;

    const distanceCenterToHider = getDistanceFromLatLonInMeters(
      N_lat,
      N_lng,
      H_lat,
      H_lng
    );

    if (distanceCenterToHider <= R_new - bufferDistance) {
      break;
    }
  }

  return {
    center: { latitude: N_lat, longitude: N_lng },
    radius: R_new,
  };
}

export default function Map() {
  const [location, setLocation] = useState<Location | null>(null);
  const [circle, setCircle] = useState<CircleType | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const gruLocation = await getGruLocation("892347");
      if (gruLocation) {
        setLocation({
          latitude: gruLocation.latitude,
          longitude: gruLocation.longitude,
          stadie: gruLocation.stadie,
        });

        let C_prev_lat = gruLocation.latitude;
        let C_prev_lng = gruLocation.longitude;
        let R_prev = (5 - gruLocation.stadie * 2) * 1000;

        const initialCircle: CircleType = {
          center: { latitude: C_prev_lat, longitude: C_prev_lng },
          radius: R_prev,
        };
        setCircle(initialCircle);

        const interval = setInterval(() => {
          const newCircle = generateNewCircle(
            C_prev_lat,
            C_prev_lng,
            R_prev,
            gruLocation.latitude,
            gruLocation.longitude
          );

          setCircle(newCircle);

          C_prev_lat = newCircle.center.latitude;
          C_prev_lng = newCircle.center.longitude;
          R_prev = newCircle.radius;
        }, 5 * 1000); // 5 sekunder i millisekunder

        // }, 15 * 60 * 1000); // 15 minutter i millisekunder

        return () => clearInterval(interval);
      }
    };
    fetchLocation();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/backgrounds/mapTitle.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {circle && (
              <Circle
                center={circle.center}
                radius={circle.radius}
                strokeWidth={2}
                strokeColor="rgba(255, 0, 0, 0.5)"
                fillColor="rgba(255, 0, 0, 0.2)"
              />
            )}
          </MapView>
        ) : (
          <View style={styles.noMapContainer}>
            <Text style={styles.noMapText}>No map yet</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  map: {
    marginTop: 100,
    height: "70%",
    width: "100%",
  },
  noMapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMapText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
