/**
 * Google OAuth Configuration for Healio
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console > Authentication > Sign-in method > Google > Enable
 * 2. Copy the "Web client ID" shown (ends in .apps.googleusercontent.com)
 * 3. Paste it below as GOOGLE_WEB_CLIENT_ID
 *
 * The same Web Client ID is used for all platforms (Expo Go, Web, Android, iOS).
 * For production Android builds, you also need an Android client ID from Google Cloud Console.
 */

export const GOOGLE_WEB_CLIENT_ID = '416648619093-cpebmqva1p0mvbpc3028blkdtgd7gsu1.apps.googleusercontent.com';

// Set to true once you've configured the client ID above
export const GOOGLE_AUTH_CONFIGURED = !GOOGLE_WEB_CLIENT_ID.includes('xxxx');
