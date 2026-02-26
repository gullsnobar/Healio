import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '../../components/auth/LoginForm';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { loginUser } from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials));
  };

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Image source={require('../../assets/images/logo.png')} style={s.logo} resizeMode="contain" />
        </View>
        {error && <Alert type="error" message={error} />}
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={() => navigation.navigate('ForgotPassword')}
          onRegister={() => navigation.navigate('Register')}
        />
        {loading && <Loading message="Signing in..." />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 120, height: 120 },
});
export default LoginScreen;
