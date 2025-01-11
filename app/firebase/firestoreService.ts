import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const gameCache: Record<string, any> = {};

// **Cache-enabled getGameByGruCode**
export const getGameByGruCode = async (gruCode: string) => {
  if (gameCache[gruCode]) {
    return gameCache[gruCode];
  }

  const q = query(
    collection(firestore, "games"),
    where("gruCode", "==", gruCode)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const gameDoc = querySnapshot.docs[0];
    gameCache[gruCode] = gameDoc; // Cache resultatet
    return gameDoc;
  } else {
    throw new Error("No game found for the provided Gru code");
  }
};

// **Verify code**
export const verifyCode = async (gruCode: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    return !!gameDoc;
  } catch (e) {
    console.error("Error verifying code: ", e);
    return false;
  }
};

// **Create a game**
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

// **Join a game**
export const joinGame = async (gruCode: string, teamName: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    const gameId = gameDoc.id;
    await addDoc(collection(firestore, "minions"), {
      teamName: teamName,
      gameId: gameId,
      joinedAt: serverTimestamp(),
    });
    return gameId;
  } catch (e) {
    console.error("Error joining game: ", e);
  }
};

// **Get teams by game**
export const subscribeToTeams = async (
  gruCode: string,
  callback: (teams: string[]) => void
): Promise<() => void> => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    const gameId = gameDoc.id;

    const teamsQuery = query(
      collection(firestore, "minions"),
      where("gameId", "==", gameId)
    );

    const unsubscribe = onSnapshot(teamsQuery, (snapshot) => {
      const teams = snapshot.docs.map((doc) => doc.data().teamName);
      callback(teams);
    });

    return unsubscribe; // Returner unsubscribe-funktionen
  } catch (e) {
    console.error("Error subscribing to teams: ", e);
    return () => {}; // Returner en tom funktion ved fejl
  }
};

// **Start the chase**
export const startChase = async (gruCode: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    const gameId = gameDoc.id;
    const gameRef = doc(firestore, "games", gameId);

    await updateDoc(gameRef, {
      status: "started",
      startTime: new Date(),
    });

    return gameId;
  } catch (e) {
    console.error("Error starting the chase: ", e);
  }
};

// **Get game document ID**
export const getGameDocumentId = async (gruCode: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    return gameDoc.id;
  } catch (e) {
    console.error("Error fetching game document ID: ", e);
    throw e;
  }
};

// **Save location to Firestore**
export const saveLocationToFirestore = async (
  gruCode: string,
  latitude: number,
  longitude: number
) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    const gameId = gameDoc.id;

    const locationCollectionRef = collection(
      firestore,
      `games/${gameId}/locations`
    );

    const currentStadie = (await getDocs(locationCollectionRef)).size;

    const locationData = {
      latitude,
      longitude,
      stadie: currentStadie + 1,
      timestamp: serverTimestamp(), // Dynamisk server-timestamp
    };

    // Gem lokationen
    await addDoc(locationCollectionRef, locationData);

    console.log("Location successfully saved with data:", locationData);
  } catch (error) {
    console.error("Error saving location:", error);
  }
};

// **Get Gru location**
export const getGruLocation = async (gruCode: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    const gameId = gameDoc.id;

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
        timestamp: locationData.timestamp,
      };
    } else {
      throw new Error("No location data found");
    }
  } catch (e) {
    console.error("Error fetching location: ", e);
    return null;
  }
};

// Subscribe to **Get chase status**
export const subscribeToChaseStatus = async (
  gruCode: string,
  callback: (status: string) => void
): Promise<() => void> => {
  try {
    const gameQuery = query(
      collection(firestore, "games"),
      where("gruCode", "==", gruCode)
    );
    const querySnapshot = await getDocs(gameQuery);

    if (querySnapshot.empty) {
      throw new Error("No game found with the provided Gru code.");
    }
    const gameDocRef = querySnapshot.docs[0].ref;

    const unsubscribe = onSnapshot(gameDocRef, (doc) => {
      const data = doc.data();
      if (data?.status) {
        callback(data.status);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to chase status:", error);
    return () => {};
  }
};


// **Update chase status**
export const updateChaseStatus = async (gruCode: string, newStatus: string) => {
  try {
    const gameDoc = await getGameByGruCode(gruCode);
    if (!gameDoc) {
      console.error("Game not found");
      return;
    }
    const gameId = gameDoc.id;
    const gameRef = doc(firestore, "games", gameId);
    
    await updateDoc(gameRef, {
      status: newStatus,
    });
  } catch (e) {
    console.error("Error updating chase status: ", e);
  }
};