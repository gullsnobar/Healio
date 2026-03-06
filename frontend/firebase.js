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

// Initialize Firebase app (this is safe and doesn't make network calls)
const app = initializeApp(firebaseConfig);

// Auth is initialized lazily to avoid startup crashes when Firebase Auth
// is not yet configured in the Firebase Console.
let _auth = null;
let _authInitialized = false;

const getFirebaseAuth = () => {
  if (!_authInitialized) {
    try {
      _auth =
        Platform.OS === "web"
          ? getAuth(app)
          : initializeAuth(app, {
              persistence: getReactNativePersistence(AsyncStorage),
            });
    } catch (e) {
      console.warn("Firebase Auth init failed:", e.message);
      _auth = null;
    }
    _authInitialized = true;
  }
  return _auth;
};

const googleProvider = new GoogleAuthProvider();

// Export a getter so auth is only initialized when actually used
export { getFirebaseAuth, googleProvider };
export default app;