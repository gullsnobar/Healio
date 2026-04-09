import { signInWithRedirect, getRedirectResult, signInWithCredential, signOut, GoogleAuthProvider } from 'firebase/auth';
import { Platform } from 'react-native';
import { getFirebaseAuth, googleProvider } from '../../../firebase';

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
   * Google Sign-In
   * - Web: uses signInWithRedirect (avoids COOP popup issues)
   * - Native: caller must pass a Google ID token from @react-native-google-signin/google-signin
   */
  signInWithGoogle: async (nativeIdToken) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error(
        'Firebase Auth is not configured. Please enable Authentication in the Firebase Console.',
      );
    }

    let user;

    if (Platform.OS === 'web') {
      // ✅ Use redirect flow instead of popup to avoid COOP issues on Expo Web
      // This will redirect user to Google login, then back to the app
      // Handle the result in useEffect with handleRedirectResult()
      await signInWithRedirect(auth, googleProvider);
      // Note: Function returns here, page will reload after redirect
      return null;
    } else {
      // ✅ Native: Use credential-based auth with Google Sign-In plugin
      if (!nativeIdToken) {
        throw new Error(
          'On native platforms, a Google ID token must be provided. ' +
          'Use @react-native-google-signin/google-signin to obtain it.',
        );
      }
      const credential = GoogleAuthProvider.credential(nativeIdToken);
      const result = await signInWithCredential(auth, credential);
      user = result.user;

      const idToken = await user.getIdToken();
      return {
        token: idToken,
        profile: {
          name: user.displayName || '',
          email: user.email || '',
          photo: user.photoURL || '',
          uid: user.uid,
        },
      };
    }
  },

  signOut: async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  },

  getCurrentUser: () => {
    const auth = getFirebaseAuth();
    return auth ? auth.currentUser : null;
  },
};
