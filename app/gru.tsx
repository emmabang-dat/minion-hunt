import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Gru() {
  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/gruBackground.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Gru has hidden, and only the cleverest Minions can find him!
        </Text>
        <Text style={styles.text}>Use this code to find him </Text>
        <Text style={styles.code}>892 - 347</Text>
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
    fontSize: 20,
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
});
