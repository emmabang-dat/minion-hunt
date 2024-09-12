import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import { useRouter } from "expo-router";
import Loading from "./loading";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "./firebase/firebaseConfig";
import { getGameDocumentId } from "./firebase/firestoreService"; 

export default function Team() {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const gruCode = "892347"; 

  useEffect(() => {
    const fetchDocumentId = async () => {
      try {
        const id = await getGameDocumentId(gruCode); 
        setDocumentId(id);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load game details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentId();
  }, [gruCode]);

  useEffect(() => {
    if (documentId) {
      const gameRef = doc(firestore, "games", documentId);

      const unsubscribe = onSnapshot(
        gameRef,
        (doc) => {
          const data = doc.data();
          if (data?.status === "started") {
            router.push("/countdown");
          }
        },
        (error) => {
          setError("Failed to load game status");
        }
      );

      return () => unsubscribe();
    }
  }, [documentId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.background}>
      <ImageBackground
        source={require("../assets/images/backgrounds/teamname.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.text}>Waiting for the game to start...</Text>
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
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
});
