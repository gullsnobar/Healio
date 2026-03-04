import { signInWithPopup, signInWithCredential, signOut, GoogleAuthProvider } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth, googleProvider } from '../../../firebase';

export const firebaseAuth = {
  /**
   * Google Sign-In
   * - Web: uses signInWithPopup (browser popup flow)
   * - Native: caller must pass a Google ID token obtained from
   *   @react-native-google-signin/google-signin, which is exchanged
   *   for a Firebase credential.
   */
  signInWithGoogle: async (nativeIdToken) => {
    let user;

    if (Platform.OS === 'web') {
      const result = await signInWithPopup(auth, googleProvider);
      user = result.user;
    } else {
      if (!nativeIdToken) {
        throw new Error(
          'On native platforms, a Google ID token must be provided. ' +
          'Use @react-native-google-signin/google-signin to obtain it.',
        );
      }
      const credential = GoogleAuthProvider.credential(nativeIdToken);
      const result = await signInWithCredential(auth, credential);
      user = result.user;
    }

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
  },
  signOut: async () => {
    await signOut(auth);
  },
  getCurrentUser: () => auth.currentUser,
};
