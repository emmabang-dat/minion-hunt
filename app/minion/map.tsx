import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getGruLocation } from "../firebase/firestoreService";
import HintBottomSheet from "@/components/BottomSheet";
// import { ChallengeButton, getRandomPositionInCircle } from "./challengeButton";
import Svg, { Path } from "react-native-svg";

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

const MIN_RADIUS = 200;

export function deg2rad(deg: number): number {
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
  let R_new = Math.max(R_prev * reductionFactor, MIN_RADIUS);

  const bufferDistance = Math.max(R_new * 0.04, 40);
  const maxCenterOffset = R_prev - R_new - bufferDistance;

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

    const distanceCenterToHider = Math.sqrt(
      deltaLat_center ** 2 + deltaLng_center ** 2
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
  const [timeLeft, setTimeLeft] = useState(15);

  const [challengePositions, setChallengePositions] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    const fetchLocation = async () => {
      const gruLocation = await getGruLocation("892347");

      if (gruLocation) {
        const startTime =
          gruLocation.timestamp.seconds * 1000 +
          gruLocation.timestamp.nanoseconds / 1e6;

        const currentTime = Date.now();

        const timeElapsed = Math.floor(
          (currentTime - startTime) / (15 * 60 * 1000)
        );

        const nextReductionTime =
          15 -
          Math.floor(
            ((currentTime - startTime) % (15 * 60 * 1000)) / (60 * 1000)
          );

        setTimeLeft(nextReductionTime);

        const initialStadie = Math.min(gruLocation.stadie + timeElapsed, 5);

        let R_prev = Math.max((5 - gruLocation.stadie * 2) * 1000, MIN_RADIUS);
        if (timeElapsed > 0) {
          R_prev = Math.max((5 - initialStadie * 2) * 1000, MIN_RADIUS);
        }

        const initialCircle: CircleType = {
          center: {
            latitude: gruLocation.latitude,
            longitude: gruLocation.longitude,
          },
          radius: R_prev,
        };

        setLocation({
          latitude: gruLocation.latitude,
          longitude: gruLocation.longitude,
          stadie: initialStadie,
        });
        setCircle(initialCircle);
      } else {
        console.error("No location data found.");
      }
    };

    fetchLocation();
  }, []);

  // useEffect(() => {
  //   if (circle) {
  //     const positions = Array.from({ length: 3 }).map(() =>
  //       getRandomPositionInCircle(circle.center, circle.radius)
  //     );
  //     setChallengePositions(positions);
  //   }
  // }, [circle]);

  useEffect(() => {
    if (timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 60 * 1000);

      return () => clearInterval(countdown);
    } else {
      setTimeLeft(15);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && circle) {
      const newCircle = generateNewCircle(
        circle.center.latitude,
        circle.center.longitude,
        circle.radius,
        location?.latitude || circle.center.latitude,
        location?.longitude || circle.center.longitude
      );

      setCircle(newCircle);
    }
  }, [timeLeft]);

  return (
    <ImageBackground
      source={require("../../assets/images/backgrounds/mapTitle.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {location ? (
          <View style={styles.container}>
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

              {/* {challengePositions.map((position, index) => (
                <Marker key={index} coordinate={position}>
                  <ChallengeButton />
                </Marker>
              ))} */}
            </MapView>
          </View>
        ) : (
          <View style={styles.noMapContainer}>
            <Text style={styles.noMapText}>No map yet</Text>
          </View>
        )}
        <HintBottomSheet>
          <View style={styles.contentBottomSheet}>
            {circle?.radius === MIN_RADIUS ? (
              <Text style={styles.textBottomSheet}>
                The circle can't get any smaller... You're on your own now!
              </Text>
            ) : (
              <Text style={styles.textBottomSheet}>
                Next hint in: {timeLeft} minute{timeLeft !== 1 ? "s" : ""}
              </Text>
            )}
            <ImageBackground
              source={require("../../assets/images/backgrounds/hintBackground.png")}
              style={styles.hintBackground}
            />
          </View>
        </HintBottomSheet>
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
  challengeButtonContainer: {
    position: "absolute",
    right: 200,
    top: 400,
    zIndex: 1,
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
  contentBottomSheet: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBottomSheet: {
    fontSize: 32,
    color: "black",
    marginTop: 22,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  hintBackground: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
});
