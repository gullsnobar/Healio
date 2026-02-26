import React, { useState, useMemo } from 'react';
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

const getStrength = (pw) => {
  if (!pw) return { label: '', color: '#ddd', width: '0%', level: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: 'Weak', color: '#e74c3c', width: '33%', level: 1 };
  if (score <= 3) return { label: 'Medium', color: '#f39c12', width: '66%', level: 2 };
  return { label: 'Strong', color: '#27ae60', width: '100%', level: 3 };
};

const PasswordReset = ({ onSubmit, loading: externalLoading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState('');

  const strength = useMemo(() => getStrength(password), [password]);
  const loading = externalLoading ?? false;

  const handleSubmit = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    onSubmit?.({ password });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark-outline" size={48} color={PRIMARY} />
      </View>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter a new password for your account</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#aaa"
          secureTextEntry={securePassword}
          autoCapitalize="none"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError('');
          }}
        />
        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.eyeBtn}>
          <Ionicons name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {password.length > 0 && (
        <View style={styles.strengthWrap}>
          <View style={styles.strengthTrack}>
            <View style={[styles.strengthBar, { width: strength.width, backgroundColor: strength.color }]} />
          </View>
          <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
        </View>
      )}

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureConfirm}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            setError('');
          }}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeBtn}>
          <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !password || !confirmPassword}
        style={styles.submitBtn}
        buttonColor={PRIMARY}
        textColor="#fff"
        contentStyle={styles.submitBtnContent}
      >
        Reset Password
      </Button>
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
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1a1a1a',
  },
  eyeBtn: {
    padding: 6,
  },
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  submitBtn: {
    borderRadius: 12,
    width: '100%',
    marginTop: 8,
  },
  submitBtnContent: {
    height: 50,
  },
});

export default PasswordReset;
