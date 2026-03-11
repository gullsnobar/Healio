import React, { useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LoginForm from '../../components/auth/LoginForm';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { loginUser, googleSignIn, clearError } from '../../redux/slices/authSlice';
import { useAppTheme } from '../../styles/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useFocusEffect(
    useCallback(() => {
      dispatch(clearError());
    }, [dispatch])
  );

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials));
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
          <Text style={[s.title, { color: colors.text }]}>Welcome back!{'\n'}Glad to see you, Again!</Text>
        </View>

        {error && <View style={s.alertWrap}><Alert variant="error" message={error} /></View>}

        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={() => navigation.navigate('ForgotPassword')}
          onRegister={() => navigation.navigate('Register')}
          onGoogleSignIn={handleGoogleSignIn}
        />
        {loading && <Loading message="Signing in..." />}
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
export default LoginScreen;
