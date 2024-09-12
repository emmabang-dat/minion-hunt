import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { verifyCode } from "./firebase/firestoreService";

export default function Minion() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handlePress = async () => {
    const isValid = await verifyCode(code);
    if (isValid) {
      router.push("/team");
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <ImageBackground
          source={require("../assets/images/backgrounds/minionBackground.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.container}>
            <Text style={styles.text}>
              Received Gru’s secret code? Enter it below to join the hunt! Once
              the code is verified, the chase begins.
            </Text>
            <Text style={styles.text}>
              Can you find Gru before everybody else?
            </Text>
            <View style={styles.button}>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter secret code"
                placeholderTextColor="black"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.startButton} onPress={handlePress}>
              <Text style={styles.startText}>Choose a team</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingTop: 250,
    padding: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#FFE135",
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
  errorText: { 
    fontSize: 16, 
    marginTop: 20,
    color: "red", 
    textAlign: "center" 
  },
});
