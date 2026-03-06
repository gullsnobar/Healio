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
import { useAppTheme } from '../../styles/theme';

const PasswordReset = ({ onSubmit, loading: externalLoading }) => {
  const { colors } = useAppTheme();
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
      <Text style={[s.title, { color: colors.text }]}>Create new password</Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        Your new password must be unique from those previously used.
      </Text>

      {/* New Password */}
      <View style={[s.inputWrap, { backgroundColor: colors.borderLight, borderColor: colors.borderLight }, focusedField === 'pw' && { borderColor: colors.primary, backgroundColor: colors.card }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="New Password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={securePassword}
          autoCapitalize="none"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(''); }}
          onFocus={() => setFocusedField('pw')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={s.eyeBtn}>
          <Ionicons name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={[s.inputWrap, { backgroundColor: colors.borderLight, borderColor: colors.borderLight }, focusedField === 'cpw' && { borderColor: colors.primary, backgroundColor: colors.card }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureConfirm}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
          onFocus={() => setFocusedField('cpw')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={s.eyeBtn}>
          <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
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
        <LinearGradient colors={disabled ? ['#94A3B8', '#94A3B8'] : [colors.primary, colors.primaryDark]} style={[s.primaryBtn, { shadowColor: colors.primary }]}>
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
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
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
