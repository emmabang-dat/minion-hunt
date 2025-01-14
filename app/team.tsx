import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  subscribeToTeams,
  startChase,
  saveLocationToFirestore,
  updateChaseStatus,
} from "./firebase/firestoreService";
import Loading from "./loading";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

export default function Team() {
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribeTeams, setUnsubscribeTeams] = useState<() => void | null>(
    () => null
  );

  const gruCode = "892347";
  const router = useRouter();

  const handlePress = async () => {
    setLoading(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      if (unsubscribeTeams) {
        unsubscribeTeams();
      }
      await startChase(gruCode);
      await updateChaseStatus(gruCode, "waiting");

      setTimeout(async () => {
        try {
          let location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          await saveLocationToFirestore(gruCode, latitude, longitude);
          await updateChaseStatus(gruCode, "started");
        } catch (error) {
          console.error(
            "Error during location saving or status update:",
            error
          );
        }
      }, 20 * 60 * 1000); 
    } catch (e) {
      console.error("Error starting the chase or tracking location: ", e);
      setError("An error occurred while starting the chase.");
    } finally {
      setLoading(false);
      router.back();
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      unsubscribe = await subscribeToTeams(gruCode, (updatedTeams) => {
        setTeams(updatedTeams);
      });
    };
    setupSubscription();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [gruCode]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
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
            {teams.length > 0 ? (
              teams.map((teamName, index) => (
                <View key={index} style={styles.button}>
                  <Text>{teamName}</Text>
                </View>
              ))
            ) : (
              <Text>No teams have joined yet.</Text>
            )}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handlePress}>
            <Text style={styles.startText}>Start the chase!</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
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
    gap: 10,
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
