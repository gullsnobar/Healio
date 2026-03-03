import React, { useState } from 'react';
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

const PRIMARY = '#0F766E';
const PRIMARY_DARK = '#0D6560';

const PasswordReset = ({ onSubmit, loading: externalLoading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const loading = externalLoading ?? false;
  const canSubmit = password && confirmPassword && !loading;
  const disabled = !canSubmit;

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
    <View style={s.container}>
      {/* Heading */}
      <Text style={s.title}>Create new password</Text>
      <Text style={s.subtitle}>
        Your new password must be unique from those previously used.
      </Text>

      {/* New Password */}
      <View style={[s.inputWrap, focusedField === 'pw' && s.inputFocused]}>
        <TextInput
          style={s.input}
          placeholder="New Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={securePassword}
          autoCapitalize="none"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(''); }}
          onFocus={() => setFocusedField('pw')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={s.eyeBtn}>
          <Ionicons name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={[s.inputWrap, focusedField === 'cpw' && s.inputFocused]}>
        <TextInput
          style={s.input}
          placeholder="Confirm Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureConfirm}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
          onFocus={() => setFocusedField('cpw')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={s.eyeBtn}>
          <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Error */}
      {!!error && (
        <View style={s.errorBanner}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* Reset Button */}
      <TouchableOpacity onPress={handleSubmit} disabled={disabled} activeOpacity={0.85}>
        <LinearGradient colors={disabled ? ['#94A3B8', '#94A3B8'] : [PRIMARY, PRIMARY_DARK]} style={s.primaryBtn}>
          <Text style={s.primaryBtnText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    height: 56,
  },
  inputFocused: {
    borderColor: PRIMARY,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    letterSpacing: 0.2,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  eyeBtn: { padding: 8 },
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
});

export default PasswordReset;
