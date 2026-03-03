import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#0F766E';
const PRIMARY_DARK = '#0D6560';
const OTP_LENGTH = 6;

const OTPVerification = ({ onVerify, onResend, email }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    setLoading(true);
    setError('');
    try {
      await onVerify?.(code);
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
    onResend?.();
  };

  const code = otp.join('');
  const isComplete = code.length === OTP_LENGTH;
  const disabled = !isComplete || loading;

  return (
    <View style={s.container}>
      {/* Heading */}
      <Text style={s.title}>OTP Verification</Text>
      <Text style={s.subtitle}>
        Enter the verification code we just sent on your email address.
      </Text>

      {/* Error */}
      {!!error && (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* OTP Boxes */}
      <View style={s.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[
              s.otpBox,
              focusedIndex === i && s.otpBoxFocused,
              digit ? s.otpBoxFilled : null,
              error ? s.otpBoxError : null,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(-1)}
            selectTextOnFocus
            caretHidden
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity onPress={handleVerify} disabled={disabled} activeOpacity={0.85} style={{ marginBottom: 32 }}>
        <LinearGradient colors={disabled ? ['#94A3B8', '#94A3B8'] : [PRIMARY, PRIMARY_DARK]} style={s.primaryBtn}>
          <Text style={s.primaryBtnText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Resend */}
      <View style={s.resendRow}>
        <Text style={s.resendLabel}>Didn't received code? </Text>
        {timer > 0 ? (
          <Text style={s.timerText}>Resend in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={s.resendAction}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {},
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 32,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    backgroundColor: '#F1F5F9',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  otpBoxFocused: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF',
  },
  otpBoxFilled: {
    borderColor: PRIMARY,
    backgroundColor: '#ECFDF5',
  },
  otpBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  primaryBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLabel: { fontSize: 14, color: '#64748B' },
  timerText: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
  resendAction: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});

export default OTPVerification;
