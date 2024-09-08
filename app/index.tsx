import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const minionButton = () => {
    router.push("/minion");
  };

  const gruButton = () => {
    router.push("/gru");
  };

  return (
    <ImageBackground
      source={require("../assets/images/backgrounds/frontpage.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={minionButton}>
          <Image
            source={require("../assets/images/minions.png")}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>I Am A Minion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gruButton} onPress={gruButton}>
          <Image
            source={require("../assets/images/gru.png")}
            style={styles.buttonImage}
          />
          <Text style={styles.gruButtonText}>I Am Gru</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: "#FFE135",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 60,
    width: "100%",
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonImage: {
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 26,
  },
  gruButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 40,
    width: "80%",
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gruButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 26,
  },
});
