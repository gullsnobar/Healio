import { Platform } from 'react-native';
import { getFirebaseAuth, googleProvider } from '../../../firebase';
import {
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

export const firebaseAuth = {
  /**
   * Handle redirect result after OAuth callback (web only)
   * Call this in useEffect on component mount for web platform
   */
  handleRedirectResult: async () => {
    const auth = getFirebaseAuth();
    if (!auth || Platform.OS !== 'web') return null;

    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const idToken = await result.user.getIdToken();
        return {
          token: idToken,
          profile: {
            name: result.user.displayName || '',
            email: result.user.email || '',
            photo: result.user.photoURL || '',
            uid: result.user.uid,
          },
        };
      }
    } catch (error) {
      console.error('Firebase redirect result error:', error);
      throw error;
    }
    return null;
  },

  /**
   * Google Sign-In (web only – uses Firebase redirect flow)
   * For native, use the useGoogleAuth hook in the component instead.
   */
  signInWithGoogleWeb: async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not configured.');
    }
    await signInWithRedirect(auth, googleProvider);
    return null;
  },

  /**
   * Process a Google ID token (from expo-auth-session on native)
   * Tries Firebase credential auth first, falls back to decoding the token directly.
   */
  processGoogleToken: async (idToken) => {
    // Try Firebase credential auth if available
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        const credential = GoogleAuthProvider.credential(idToken);
        const fbResult = await signInWithCredential(auth, credential);
        const firebaseToken = await fbResult.user.getIdToken();
        return {
          token: firebaseToken,
          profile: {
            name: fbResult.user.displayName || '',
            email: fbResult.user.email || '',
            photo: fbResult.user.photoURL || '',
            uid: fbResult.user.uid,
          },
        };
      }
    } catch (firebaseErr) {
      console.warn('Firebase credential sign-in unavailable, using Google token directly:', firebaseErr.message);
    }

    // Fallback: decode the JWT to get profile info
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return {
      token: idToken,
      profile: {
        name: payload.name || '',
        email: payload.email || '',
        photo: payload.picture || '',
        uid: payload.sub,
      },
    };
  },

  signOut: async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign out error:', err.message);
    }
  },

  getCurrentUser: () => {
    try {
      const auth = getFirebaseAuth();
      return auth ? auth.currentUser : null;
    } catch {
      return null;
    }
  },
};
