import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

export default function Map() {
  // Screen height
  const screenHeight = Dimensions.get("window").height;

  // Bottom sheet position controlled by Animated.Value
  const bottomSheetPosition = useRef(new Animated.Value(screenHeight)).current;

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    Animated.timing(bottomSheetPosition, {
      toValue: screenHeight * 0.65, // Slide up to cover 35% of the screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/mapTitle.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={openBottomSheet} style={styles.button}>
          <Text>Open Bottom Sheet</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomSheetPosition }],
          },
        ]}
      >
        <Text>Slide Up Bottom Sheet Content Here</Text>
      </Animated.View>
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
  bottomSheet: {
    position: "absolute",
    height: "35%",
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
});
