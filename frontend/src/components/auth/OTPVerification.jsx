import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';
const OTP_LENGTH = 6;

const OTPVerification = ({ onVerify, onResend, email }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
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
    try {
      await onVerify?.(code);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputs.current[0]?.focus();
    onResend?.();
  };

  const code = otp.join('');

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="mail-open-outline" size={48} color={PRIMARY} />
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We sent a {OTP_LENGTH}-digit code to{'\n'}
        <Text style={styles.email}>{email || 'your email'}</Text>
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            selectTextOnFocus
          />
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        disabled={loading || code.length !== OTP_LENGTH}
        style={styles.verifyBtn}
        buttonColor={PRIMARY}
        textColor="#fff"
        contentStyle={styles.verifyBtnContent}
      >
        Verify
      </Button>

      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend code in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF2FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  email: {
    color: PRIMARY,
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
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  otpBoxFilled: {
    borderColor: PRIMARY,
    backgroundColor: '#EBF2FB',
  },
  verifyBtn: {
    borderRadius: 12,
    width: '100%',
  },
  verifyBtnContent: {
    height: 50,
  },
  resendRow: {
    marginTop: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#888',
  },
  resendLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
});

export default OTPVerification;
