// Import only the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqdDZNyFT9rucx-4XESVia15qFtELbPgI",
  authDomain: "healio-e75ef.firebaseapp.com",
  projectId: "healio-e75ef",
  storageBucket: "healio-e75ef.firebasestorage.app",
  messagingSenderId: "416648619093",
  appId: "1:416648619093:web:5855407080e76b83d860dc",
  measurementId: "G-4186MCDMN9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// On web, getAuth() uses browser persistence (indexedDB/localStorage).
// On native (Android/iOS), we must use AsyncStorage for persistence.
const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;