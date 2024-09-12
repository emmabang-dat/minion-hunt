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
    const q = query(collection(firestore, "games"), where("gruCode", "==", gruCode));
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