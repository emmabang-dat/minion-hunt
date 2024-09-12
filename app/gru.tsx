import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function Gru() {
  const router = useRouter();
  
  const handlePress = () => {
    router.push("/minionteam");
  };

  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/gruBackground.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Here’s your secret code. Share it with the Minions, but only the
          cleverest will succeed!
        </Text>
        <Text style={styles.text}>Let the game of hide and seek begin. </Text>
        <Text style={styles.code}>892 - 347</Text>
        <TouchableOpacity style={styles.startButton} onPress={handlePress}>
          <Text style={styles.startText}>View the teams</Text>
        </TouchableOpacity>
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
    paddingTop: 300,
    padding: 24,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  code: {
    marginTop: 10,
    fontSize: 40,
    color: "#FF5252",
    fontWeight: "bold",
    textAlign: "center",
  },
  startButton: {
    marginTop: 30,
    backgroundColor: "#0052CC",
    alignItems: "center",
    opacity: 0.75,
    width: "50%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
  },
  startText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
