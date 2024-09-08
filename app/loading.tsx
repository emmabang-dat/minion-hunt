import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";

export default function Loading() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/favicon.png")}
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
  },
  image: {
    width: 150,
    height: 115,
    alignSelf: "center",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
});