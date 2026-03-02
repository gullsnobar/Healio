import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import OTPVerification from '../../components/auth/OTPVerification';
import { authAPI } from '../../services/api/authAPI';
import { verifyOTP } from '../../redux/slices/authSlice';

const OTPScreen = ({ route, navigation }) => {
  const { email, mode } = route.params || {};
  const dispatch = useDispatch();

  const handleVerify = async (otp) => {
    if (mode === 'reset') {
      // For password reset — just verify, then go to reset screen
      await authAPI.verifyOTP(email, otp, 'reset');
      navigation.navigate('ResetPassword', { email, otp });
    } else {
      // For registration — verify + auto-login via Redux
      const result = await dispatch(verifyOTP({ email, otp })).unwrap();
      // If tokens were returned, isAuthenticated becomes true and
      // AppNavigator auto-switches to MainNavigator — no explicit nav needed
    }
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
          <OTPVerification email={email} onVerify={handleVerify} onResend={handleResend} onBack={() => navigation.goBack()} />
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
