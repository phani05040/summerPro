import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
};

let app = null;
if (apiKey && authDomain && projectId) {
  app = initializeApp(firebaseConfig);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut };