import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCHmTa7ULMXtYlHydkP3ikuCPKO__0m0I0",
  authDomain: "sheild-9ff62.firebaseapp.com",
  projectId: "sheild-9ff62",
  storageBucket: "sheild-9ff62.firebasestorage.app",
  messagingSenderId: "59660053149",
  appId: "1:59660053149:web:ab6210c26a2c7b484c4274",
  measurementId: "G-PZ7RF30T0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);