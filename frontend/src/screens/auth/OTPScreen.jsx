import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import OTPVerification from '../../components/auth/OTPVerification';
import { authAPI } from '../../services/api/authAPI';
import { verifyOTP } from '../../redux/slices/authSlice';

const OTPScreen = ({ route, navigation }) => {
  const { email, mode } = route.params || {};
  const dispatch = useDispatch();

  const handleVerify = async (otp) => {
    if (mode === 'reset') {
      await authAPI.verifyOTP(email, otp, 'reset');
      navigation.navigate('ResetPassword', { email, otp });
    } else {
      await dispatch(verifyOTP({ email, otp })).unwrap();
    }
  };

  const handleResend = () => authAPI.resendOTP(email);

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>

        <OTPVerification email={email} onVerify={handleVerify} onResend={handleResend} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
});
export default OTPScreen;
