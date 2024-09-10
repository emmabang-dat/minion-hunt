import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function Countdown() {
  const router = useRouter();

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
          <Text style={styles.text}>12 minutes left</Text>
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
