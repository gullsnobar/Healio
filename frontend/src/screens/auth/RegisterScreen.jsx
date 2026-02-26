import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RegisterForm from '../../components/auth/RegisterForm';
import Alert from '../../components/common/Alert';
import { registerUser } from '../../redux/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) navigation.navigate('OTP', { email: data.email });
  };

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll}>
        {error && <Alert type="error" message={error} />}
        <RegisterForm onSubmit={handleRegister} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' }, scroll: { flexGrow: 1, padding: 24 } });
export default RegisterScreen;
