import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";

export const verifyCode = async (gruCode: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error verifying code: ", e);
    return false;
  }
};

export const createGame = async (gruCode: string) => {
  try {
    const docRef = await addDoc(collection(firestore, "games"), {
      gruCode: gruCode,
      createdAt: serverTimestamp(),
      status: "waiting",
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const joinGame = async (gruCode: string, teamName: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const gameId = querySnapshot.docs[0].id;
      await addDoc(collection(firestore, "minions"), {
        teamName: teamName,
        gameId: gameId,
        joinedAt: serverTimestamp(),
      });
      return gameId;
    } else {
      throw new Error("Invalid Gru code");
    }
  } catch (e) {
    console.error("Error joining game: ", e);
  }
};

export const getTeamsByGame = async (gruCode: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const gameSnapshot = await getDocs(q);

    if (!gameSnapshot.empty) {
      const gameId = gameSnapshot.docs[0].id;
      const teamsQuery = query(
        collection(firestore, "minions"),
        where("gameId", "==", gameId)
      );
      const teamsSnapshot = await getDocs(teamsQuery);

      const teams = teamsSnapshot.docs.map((doc) => doc.data().teamName);
      return teams;
    } else {
      throw new Error("No game found for the provided Gru code");
    }
  } catch (e) {
    console.error("Error fetching teams: ", e);
    return [];
  }
};

export const startChase = async (gruCode: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const gameId = querySnapshot.docs[0].id;
      const gameRef = doc(firestore, "games", gameId);
      await updateDoc(gameRef, { status: "started" });
      return gameId;
    } else {
      throw new Error("Invalid Gru code");
    }
  } catch (e) {
    console.error("Error starting the chase: ", e);
  }
};

export const getGameDocumentId = async (gruCode: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    } else {
      throw new Error("No game found for the provided Gru code");
    }
  } catch (e) {
    console.error("Error fetching game document ID: ", e);
    throw e;
  }
};

export const saveLocationToFirestore = async (
  gruCode: string,
  latitude: number,
  longitude: number
) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const gameId = querySnapshot.docs[0].id;

      // Get the current 'stadie' value
      const locationCollectionRef = collection(
        firestore,
        `games/${gameId}/locations`
      );
      const locationSnapshot = await getDocs(locationCollectionRef);
      const currentStadie = locationSnapshot.size; 

      const locationRef = doc(locationCollectionRef);

      await setDoc(locationRef, {
        latitude,
        longitude,
        stadie: currentStadie + 1,
        timestamp: serverTimestamp(),
      });

      console.log(
        "Location successfully saved with stadie:",
        currentStadie + 1
      );
    } else {
      throw new Error("Invalid Gru code");
    }
  } catch (e) {
    console.error("Error saving location: ", e);
  }
};

export const getGruLocation = async (gruCode: string) => {
  try {
    const q = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const gameId = querySnapshot.docs[0].id;

      const locationQuery = query(
        collection(firestore, `games/${gameId}/locations`),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const locationSnapshot = await getDocs(locationQuery);

      if (!locationSnapshot.empty) {
        const locationData = locationSnapshot.docs[0].data();
        return {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          stadie: locationData.stadie, 
        };
      } else {
        throw new Error("No location data found");
      }
    } else {
      throw new Error("Invalid Gru code");
    }
  } catch (e) {
    console.error("Error fetching location: ", e);
    return null;
  }
};
