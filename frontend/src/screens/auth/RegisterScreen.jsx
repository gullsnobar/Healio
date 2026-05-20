import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import RegisterForm from '../../components/auth/RegisterForm';
import AlertBanner from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { registerUser, googleSignIn, clearError } from '../../redux/slices/authSlice';
import { useAppTheme } from '../../styles/ThemeContext';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_AUTH_CONFIGURED } from '../../config/googleAuthConfig';

// Required for expo-auth-session to complete the auth flow on Android
if (Platform.OS !== 'web') {
  try {
    const { maybeCompleteAuthSession } = require('expo-web-browser');
    maybeCompleteAuthSession();
  } catch (e) {
    console.warn('expo-web-browser not available');
  }
}

const RegisterScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Google Auth via expo-auth-session (works in Expo Go on native)
  // redirectUri must be registered in Google Cloud Console > OAuth 2.0 credentials
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(clearError());
    }, [dispatch])
  );

  // Handle Google Sign-In response on native
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const idToken = googleResponse.params.id_token;
      if (idToken) {
        dispatch(googleSignIn(idToken));
      }
    } else if (googleResponse?.type === 'error') {
      console.error('Google Sign-In error:', googleResponse.error);
    }
  }, [googleResponse]);

  const handleRegister = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      dispatch(clearError());
      const regData = result.payload?.data;
      navigation.navigate('OTP', {
        email: data.email,
        otpSent: regData?.otpSent ?? true,
      });
    }
  };

  const handleGoogleSignIn = () => {
    if (!GOOGLE_AUTH_CONFIGURED) {
      Alert.alert(
        'Setup Required',
        'Google Sign-In requires configuration.\n\nPlease set your Google Web Client ID in:\nfrontend/src/config/googleAuthConfig.js\n\nGet it from Firebase Console > Authentication > Sign-in method > Google.',
      );
      return;
    }

    if (Platform.OS === 'web') {
      dispatch(googleSignIn()); // Web: triggers Firebase redirect
    } else {
      promptGoogleAsync({ useProxy: true }); // Native: use Expo auth proxy
    }
  };

  return (
    <KeyboardAvoidingView style={[s.c, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Heading */}
        <View style={s.header}>
          <Text style={[s.title, { color: colors.text }]}>Hello! Register to{'\n'}get started</Text>
        </View>

        {error && <View style={s.alertWrap}><AlertBanner variant="error" message={error} /></View>}

        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          onLogin={() => navigation.navigate('Login')}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  alertWrap: {
    marginBottom: 16,
  },
});
export default RegisterScreen;
