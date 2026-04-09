// Import only the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { Platform } from "react-native";

let AsyncStorage;
let getReactNativePersistence;

// Only import AsyncStorage on native platforms (avoid webpack resolution warnings)
// Check for browser environment - if window exists, we're in a browser
if (typeof window === "undefined") {
  try {
    // eslint-disable-next-line global-require
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
    // Dynamically require to avoid webpack warnings
    if (typeof require !== "undefined") {
      try {
        // eslint-disable-next-line global-require
        const firebaseAuthRN = require("firebase/auth/react-native");
        getReactNativePersistence = firebaseAuthRN.getReactNativePersistence;
      } catch (innerError) {
        // React Native auth module not available in this environment
        console.debug("Firebase React Native auth not available");
      }
    }
  } catch (e) {
    // Fallback for web or if native modules aren't available
    console.debug("Native async storage not available");
  }
}

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
      if (Platform.OS === "web") {
        _auth = getAuth(app);
      } else if (getReactNativePersistence && AsyncStorage) {
        _auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      } else {
        _auth = getAuth(app);
      }
    } catch (e) {
      console.warn("Firebase Auth init failed:", e.message);
      _auth = getAuth(app);
    }
    _authInitialized = true;
  }
  return _auth;
};

const googleProvider = new GoogleAuthProvider();

// Export a getter so auth is only initialized when actually used
export { getFirebaseAuth, googleProvider };
export default app;