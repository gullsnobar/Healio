import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#4A90D9';
const PRIMARY_DARK = '#3A7BC8';
const OTP_LENGTH = 6;

const OTPVerification = ({ onVerify, onResend, email, devOtp }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (devOtp) {
      const digits = devOtp.toString().split('').slice(0, OTP_LENGTH);
      setOtp(digits.concat(Array(OTP_LENGTH - digits.length).fill('')));
    } else {
      inputs.current[0]?.focus();
    }
  }, [devOtp]);

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

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrap}>
        <View style={styles.iconInner}>
          <Ionicons name="shield-checkmark-outline" size={40} color={PRIMARY} />
        </View>
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We sent a {OTP_LENGTH}-digit code to
      </Text>
      <Text style={styles.email}>{email || 'your email'}</Text>

      {/* Error message */}
      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color="#E74C3C" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              error ? styles.otpBoxError : null,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading || !isComplete}
        activeOpacity={0.85}
        style={[styles.verifyBtnOuter, (!isComplete || loading) && styles.verifyBtnDisabled]}
      >
        <LinearGradient
          colors={!isComplete || loading ? ['#B0C4DE', '#A0B8D0'] : [PRIMARY, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.verifyBtnGradient}
        >
          {loading ? (
            <Text style={styles.verifyBtnText}>Verifying...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.verifyBtnText}>Verify</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Resend */}
      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            Resend code in <Text style={styles.timerBold}>{timer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
            <Ionicons name="refresh-outline" size={16} color={PRIMARY} style={{ marginRight: 6 }} />
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 28,
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 24,
  },
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EBF2FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#D6E6F9',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e9e',
    textAlign: 'center',
    lineHeight: 20,
  },
  email: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 28,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  otpBox: {
    width: 50,
    height: 58,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e0e5ec',
    backgroundColor: '#f8f9fb',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFilled: {
    borderColor: PRIMARY,
    backgroundColor: '#EBF2FB',
    shadowColor: PRIMARY,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  otpBoxError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FEF2F2',
  },
  verifyBtnOuter: {
    borderRadius: 14,
    width: '100%',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  verifyBtnDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  verifyBtnGradient: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendRow: {
    marginTop: 28,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#8e8e9e',
  },
  timerBold: {
    fontWeight: '700',
    color: '#6b6b7b',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#EBF2FB',
  },
  resendLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },
});

export default OTPVerification;
