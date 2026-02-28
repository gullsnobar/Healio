import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import OTPVerification from '../../components/auth/OTPVerification';
import { authAPI } from '../../services/api/authAPI';

const OTPScreen = ({ route, navigation }) => {
  const { email, mode, devOtp } = route.params || {};

  const handleVerify = async (otp) => {
    await authAPI.verifyOTP(email, otp);
    if (mode === 'reset') navigation.navigate('ResetPassword', { email, otp });
    else navigation.navigate('Login');
  };

  const handleResend = () => authAPI.resendOTP(email);

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <OTPVerification email={email} onVerify={handleVerify} onResend={handleResend} devOtp={devOtp} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
});
export default OTPScreen;
