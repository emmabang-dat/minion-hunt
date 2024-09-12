import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-IAYSoCvYWUEtjzrfywjDVVrXbU89eOw",
  authDomain: "minionhunt-d2061.firebaseapp.com",
  projectId: "minionhunt-d2061",
  storageBucket: "minionhunt-d2061.appspot.com",
  messagingSenderId: "893350747391",
  appId: "1:893350747391:web:d461cf1ecb14150c4040ca",
};

const firebaseApp = initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);

export { firestore };
