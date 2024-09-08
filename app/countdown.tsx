import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Countdown() {
  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/countdown.png")}
      style={styles.background}
    >
      <TouchableOpacity style={styles.container}>
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
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
