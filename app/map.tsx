import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { getGruLocation } from "./firebase/firestoreService";

export default function Map() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    stadie: number;
  } | null>(null);

  // Hent Gru's GPS-lokation fra Firestore
  useEffect(() => {
    const fetchLocation = async () => {
      const gruLocation = await getGruLocation("892347");
      if (gruLocation) {
        setLocation({
          latitude: gruLocation.latitude,
          longitude: gruLocation.longitude,
          stadie: gruLocation.stadie,
        });
      }
    };
    fetchLocation();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/mapTitle.png")}
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
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={(5 - location.stadie * 2) * 1000} // Start at 10 km, decrease by 2 km per stage
              strokeWidth={2}
              strokeColor="rgba(255, 0, 0, 0.5)"
              fillColor="rgba(255, 0, 0, 0.2)"
            />
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
