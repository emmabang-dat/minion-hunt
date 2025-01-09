import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import {
  subscribeToChaseStatus,
  updateChaseStatus,
  getGameByGruCode,
} from "../firebase/firestoreService";

export default function Countdown() {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number | null>(null);
  const [chaseStatus, setChaseStatus] = useState<string | null>(null);
  const gruCode = "892347";

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let interval: NodeJS.Timeout | null = null;

    const setupSubscription = async () => {
      unsubscribe = await subscribeToChaseStatus(gruCode, async (status) => {
        setChaseStatus(status);

        if (status === "waiting") {
          // Hent startTime fra Firestore
          const gameDoc = await getGameByGruCode(gruCode);
          const startTime = gameDoc.data()?.startTime?.toDate(); // Forventet som Firestore timestamp

          if (startTime) {
            const elapsedSeconds = Math.floor(
              (Date.now() - startTime.getTime()) / 1000
            );
            const remainingTime = 20 * 60 - elapsedSeconds;

            if (remainingTime > 0) {
              setSeconds(remainingTime);

              interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                  if (prevSeconds !== null && prevSeconds > 1) {
                    return prevSeconds - 1;
                  } else {
                    clearInterval(interval!);
                    updateChaseStatus(gruCode, "started");
                    router.push("/minion/map");
                    return null;
                  }
                });
              }, 1000);
            } else {
              // Hvis tiden allerede er udløbet, opdater status til "started"
              await updateChaseStatus(gruCode, "started");
              router.push("/minion/map");
            }
          }
        }

        if (status === "started") {
          // Hvis status allerede er started, gå direkte til map-siden
          if (interval) clearInterval(interval);
          router.push("/minion/map");
        }
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [gruCode, router]);

  return (
    <ImageBackground
      source={require("../../assets/images/backgrounds/countdown.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textBox}>
          {chaseStatus === "waiting" ? (
            seconds !== null ? (
              <Text style={styles.text}>
                {Math.floor(seconds / 60)} minutes{" "}
                {seconds % 60 > 0 && `${seconds % 60} seconds`} left
              </Text>
            ) : (
              <Text style={styles.text}>Calculating time...</Text>
            )
          ) : chaseStatus === "started" ? (
            <Text style={styles.text}>Chase has started!</Text>
          ) : (
            <Text style={styles.text}>
              Waiting for Gru to start the countdown
            </Text>
          )}
        </View>
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
    paddingTop: 230,
    padding: 24,
  },
  textBox: {
    backgroundColor: "#0052CC",
    opacity: 0.75,
    padding: 40,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});