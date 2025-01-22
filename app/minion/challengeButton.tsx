import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { deg2rad } from "./map";

const challengeVariations = [
  {
    color: "#357FFF",
    icon: require("../../assets/icons/footsteps-icon.png"),
    title: "Physical Challenge",
    text: [
      "Take a picture of yourself running or posing in front of three different yellow objects.",
      "Can you find all three within 10 minutes?",
    ],
    textColor: "#FFFFFF",
  },
  {
    color: "#30F022",
    icon: require("../../assets/icons/search-icon.png"),
    title: "Problem-Solving",
    text: [
      "Find a location that matches this clue:",
      "‘I’m tall, I watch over the city, and people take pictures with me every day.’",
      "Submit a picture when you find it.",
    ],
    textColor: "#000000",
  },
  {
    color: "#FFE135",
    icon: require("../../assets/icons/camera-icon.png"),
    title: "Social Challenge",
    text: [
      "Find a stranger and take a selfie together where both of you are making a funny face.",
      "The funnier, the better!",
    ],
    textColor: "#000000",
  },
];

export function getRandomPositionInCircle(center: { latitude: number; longitude: number }, radius: number) {
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.sqrt(Math.random()) * radius;
  
    const offsetLatitude = (randomRadius * Math.cos(randomAngle)) / 111320;
    const offsetLongitude =
      (randomRadius * Math.sin(randomAngle)) /
      (111320 * Math.cos(deg2rad(center.latitude)));
  
    return {
      latitude: center.latitude + offsetLatitude,
      longitude: center.longitude + offsetLongitude,
    };
  }

export const ChallengeButton = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentChallenge, setCurrentChallenge] = useState(0);
  
    const openChallenge = (index: number) => {
      setCurrentChallenge(index);
      setModalVisible(true);
    };
  
    const closeChallenge = () => {
      setModalVisible(false);
    };
      
  
    const challenge = challengeVariations[currentChallenge];
  
    return (
      <View style={styles.container}>
        {challengeVariations.map((challenge, index) => (
          <TouchableOpacity
            key={index}
            style={styles.challengeButton}
            onPress={() => openChallenge(index)}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Svg
                width="50"
                height="90"
                viewBox="0 0 100 100"
                style={styles.droplet}
              >
                <Path
                  d="M50 5
                     C30 5 15 20 15 40
                     C15 65 50 95 50 95
                     C50 95 85 65 85 40
                     C85 20 70 5 50 5Z"
                  fill={challenge.color}
                />
              </Svg>
              <Image source={challenge.icon} style={styles.icon} />
            </View>
          </TouchableOpacity>
        ))}
  
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeChallenge}
          statusBarTranslucent={true}
        >
          <View style={styles.modalBackground}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: challenge.color },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={closeChallenge}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke={challenge.textColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
  
              <Text
                style={[styles.challengeTitle, { color: challenge.textColor }]}
              >
                {challenge.title}
              </Text>
              <View>
                {challenge.text.map((paragraph, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.challengeText,
                      { color: challenge.textColor },
                    ]}
                  >
                    {paragraph}
                  </Text>
                ))}
              </View>
  
              <TouchableOpacity
                style={styles.startButton}
                onPress={closeChallenge}
              >
                <Text style={styles.startText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  challengeButton: {
    width: 50,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  droplet: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: "35%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: "semibold",
    marginBottom: 20,
    textAlign: "center",
  },
  challengeText: {
    fontSize: 18,
    fontWeight: "medium",
    marginBottom: 20,
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

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
