import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function NotFoundScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/404.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Link href="/" style={styles.text}>Go back to the home page </Link>
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
    paddingTop: 400,
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
