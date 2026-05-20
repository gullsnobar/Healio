// Import only the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  getReactNativePersistence,
} from "firebase/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    _authInitialized = true;
    try {
      if (Platform.OS === "web") {
        _auth = getAuth(app);
      } else {
        // Use AsyncStorage for React Native persistence
        _auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      }
    } catch (e) {
      console.warn("Firebase Auth init skipped:", e.message);
      // On Expo Go, native Firebase Auth modules may not be available.
      // Return null — Google Sign-In will use expo-auth-session instead.
      _auth = null;
    }
  }
  return _auth;
};

const googleProvider = new GoogleAuthProvider();

// Export a getter so auth is only initialized when actually used
export { getFirebaseAuth, googleProvider };
export default app;