import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#4A90D9';
const PRIMARY_DARK = '#3A7BC8';

const getStrength = (pw) => {
  if (!pw) return { label: '', color: '#ddd', width: '0%', level: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: 'Weak', color: '#EF4444', width: '33%', level: 1 };
  if (score <= 3) return { label: 'Medium', color: '#F59E0B', width: '66%', level: 2 };
  return { label: 'Strong', color: '#10B981', width: '100%', level: 3 };
};

const PasswordReset = ({ onSubmit, loading: externalLoading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const strength = useMemo(() => getStrength(password), [password]);
  const loading = externalLoading ?? false;
  const canSubmit = password && confirmPassword && !loading;

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
        <View style={styles.iconInner}>
          <Ionicons name="shield-checkmark-outline" size={40} color={PRIMARY} />
        </View>
      </View>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Create a new secure password for your account</Text>

      <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={focusedField === 'password' ? PRIMARY : '#9CA3AF'} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry={securePassword}
          autoCapitalize="none"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(''); }}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.eyeBtn}>
          <Ionicons name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
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

      <View style={[styles.inputWrapper, focusedField === 'confirm' && styles.inputWrapperFocused]}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={20} color={focusedField === 'confirm' ? PRIMARY : '#9CA3AF'} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry={secureConfirm}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
          onFocus={() => setFocusedField('confirm')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeBtn}>
          <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {!!error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.85}
        style={[styles.btnOuter, !canSubmit && styles.btnDisabled]}
      >
        <LinearGradient
          colors={!canSubmit ? ['#B0C4DE', '#A0B8D0'] : [PRIMARY, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnGradient}
        >
          {loading ? (
            <Text style={styles.btnText}>Resetting...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Reset Password</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
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
    color: '#1B2332',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e9e',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 4,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e8edf2',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#1B2332',
    letterSpacing: 0.3,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
  },
  eyeBtn: {
    padding: 10,
  },
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    marginTop: -4,
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 50,
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
    color: '#EF4444',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  btnOuter: {
    borderRadius: 14,
    width: '100%',
    marginTop: 4,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  btnGradient: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PasswordReset;
