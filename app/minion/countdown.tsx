import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { getChaseStatus } from "../firebase/firestoreService";

export default function Countdown() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10);
  const [chaseStatus, setChaseStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchChaseStatus = async () => {
      try {
        const status = await getChaseStatus("892347");
        setChaseStatus(status);
      } catch (error) {
        console.error("Error fetching chase status:", error);
      }
    };

    fetchChaseStatus();
  }, []);

  useEffect(() => {
    if (chaseStatus === "started" && seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (seconds <= 0) {
      router.push("/minion/map");
    }
  }, [seconds, chaseStatus, router]);

  return (
    <ImageBackground
      source={require("../../assets/images/backgrounds/countdown.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.textBox}>
          {chaseStatus === "started" ? (
            <Text style={styles.text}>{seconds} seconds left</Text>
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
