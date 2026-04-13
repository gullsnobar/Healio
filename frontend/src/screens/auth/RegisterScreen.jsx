import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RegisterForm from '../../components/auth/RegisterForm';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { registerUser, googleSignIn, clearError } from '../../redux/slices/authSlice';
import { useAppTheme } from '../../styles/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useFocusEffect(
    useCallback(() => {
      dispatch(clearError());
    }, [dispatch])
  );

  const handleRegister = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      dispatch(clearError());
      const regData = result.payload?.data;
      
      // Development mode auto-login: if tokens are returned, auto-login the user
      if (regData?.accessToken && regData?.isDev) {
        console.log('[RegisterScreen] Dev mode auto-login triggered');
        // Navigation will happen automatically based on auth state (checkAuth)
        return;
      }
      
      // Production mode: require OTP verification
      navigation.navigate('OTP', {
        email: data.email,
        otpSent: regData?.otpSent ?? true,
      });
    }
  };

  const handleGoogleSignIn = () => {
    dispatch(googleSignIn());
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

        {error && <View style={s.alertWrap}><Alert variant="error" message={error} /></View>}

        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          onLogin={() => navigation.navigate('Login')}
          onGoogleSignIn={handleGoogleSignIn}
        />
        {loading && <Loading message="Creating your account..." />}
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
    paddingTop: 16,
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
