import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Map() {
  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/map.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View></View>
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
    paddingTop: 200,
    padding: 24,
  },
});