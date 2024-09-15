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
import { joinGame } from "../firebase/firestoreService";

export default function Team() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");

  const handlePress = async () => {
    try {
      const gruCode = "892347";
      await joinGame(gruCode, teamName);
      router.push("/minion/waiting");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <ImageBackground
          source={require("../../assets/images/backgrounds/teamname.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.container}>
            <Text style={styles.text}>
              What’s a Minion without a team? Pick a name that strikes fear into
              Gru (or at least makes him chuckle).
            </Text>
            <Text style={styles.text}>
              Choose wisely – your team name is key to victory!
            </Text>
            <View style={styles.button}>
              <TextInput
                value={teamName}
                onChangeText={setTeamName}
                placeholder="Enter your awesome team name..."
                placeholderTextColor="black"
                maxLength={32}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.startButton} onPress={handlePress}>
              <Text style={styles.startText}>Start the chase!</Text>
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
    color: "red", 
    marginTop: 20, 
    textAlign: "center" 
  },
});
