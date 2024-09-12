import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

export default function Countdown() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10); 

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      router.push("/map");
    }
  }, [seconds, router]);

  const minionButton = () => {
    router.push("/map");
  };

  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/countdown.png")}
      style={styles.background}
    >
      <TouchableOpacity style={styles.container} onPress={minionButton}>
        <View style={styles.textBox}>
          <Text style={styles.text}>{seconds} seconds left</Text>
        </View>
      </TouchableOpacity>
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
