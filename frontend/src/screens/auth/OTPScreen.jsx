import React from 'react';
import { View, StyleSheet } from 'react-native';
import OTPVerification from '../../components/auth/OTPVerification';
import { authAPI } from '../../services/api/authAPI';

const OTPScreen = ({ route, navigation }) => {
  const { email, mode } = route.params || {};

  const handleVerify = async (otp) => {
    await authAPI.verifyOTP(email, otp);
    if (mode === 'reset') navigation.navigate('ResetPassword', { email, otp });
    else navigation.navigate('Login');
  };

  const handleResend = () => authAPI.resendOTP(email);

  return (
    <View style={s.c}>
      <OTPVerification email={email} onVerify={handleVerify} onResend={handleResend} />
    </View>
  );
};

const s = StyleSheet.create({ c: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F5F7FA' } });
export default OTPScreen;
