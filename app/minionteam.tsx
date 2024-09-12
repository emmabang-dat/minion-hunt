import { useRouter } from "expo-router";
import React from "react";
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
import { ScrollView } from "react-native-gesture-handler";

export default function MinionTeam() {
  const router = useRouter();

  const handlePress = () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <ImageBackground
          source={require("../assets/images/backgrounds/theTeams.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.container}>
            <Text style={styles.text}>
              These brave Minions think they can find you... When you’re ready,
              press the button to start the chase and watch them scramble!
            </Text>
            <View style={styles.teams}>
              <View style={styles.button}>
                <Text>The Banana Team</Text>
              </View>
              <View style={styles.button}>
                <Text>Unicorns</Text>
              </View>
              <View style={styles.button}>
                <Text>The Winners</Text>
              </View>
              <View style={styles.button}>
                <Text>The Banana Team</Text>
              </View>
              <View style={styles.button}>
                <Text>Unicorns</Text>
              </View>
            </View>
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
  teams: {
    gap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#FFE135",
    paddingVertical: 15,
    alignSelf: "flex-start",
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
});
