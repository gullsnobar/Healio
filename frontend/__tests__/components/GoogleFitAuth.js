import React, { useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import { Button } from 'react-native';

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function GoogleFitAuth({ onToken }) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "554648146452-dp3pnmjesjr1urf2fuagdraguk9dvu30.apps.googleusercontent.com", // replace with Google Cloud OAuth Client ID
      scopes: [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.body.read"
      ],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true, // required for Expo
      }),
    },
    discovery
  );

  // Listen for login response
  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      onToken(access_token); // send token to parent component
    }
  }, [response]);

  return <Button disabled={!request} title="Connect Google Fit" onPress={() => promptAsync()} />;
}