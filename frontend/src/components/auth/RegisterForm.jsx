import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';

const RegisterForm = ({ onSubmit, onLogin, onGoogleSignIn }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Invalid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
    } catch {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.fullName && form.email && form.phone && form.password && form.confirmPassword;
  const disabled = loading || !canSubmit;

  const FIELD_ICONS = {
    fullName: 'person-outline',
    email: 'mail-outline',
    phone: 'call-outline',
    password: 'lock-closed-outline',
    confirmPassword: 'shield-checkmark-outline',
  };

  const renderInput = (key, placeholder, extra = {}) => {
    const isFocused = focusedField === key;
    const hasError = !!errors[key];
    return (
      <View key={key} style={{ marginBottom: hasError ? 4 : 16 }}>
        <View style={[s.inputWrap, { backgroundColor: colors.cardAlt, borderColor: colors.cardAlt },
          isFocused && { borderColor: colors.primary, backgroundColor: colors.card },
          hasError && { borderColor: colors.error }]}>
          <Ionicons name={FIELD_ICONS[key] || 'ellipse-outline'} size={20} color={isFocused ? colors.primary : colors.textTertiary} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            value={form[key]}
            onChangeText={(v) => update(key, v)}
            autoCapitalize={extra.autoCapitalize ?? 'none'}
            autoComplete={extra.autoComplete ?? 'off'}
            textContentType={extra.textContentType ?? 'none'}
            nativeID={`register-${key}`}
            keyboardType={extra.keyboardType ?? 'default'}
            secureTextEntry={extra.secure}
            onFocus={() => setFocusedField(key)}
            onBlur={() => setFocusedField(null)}
          />
          {extra.toggle && (
            <TouchableOpacity onPress={extra.toggle} style={s.eyeBtn}>
              <Ionicons name={extra.secure ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        {hasError && <Text style={s.errorText}>{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <View style={s.container}>
      {renderInput('fullName', 'Full Name', { autoCapitalize: 'words', autoComplete: 'name', textContentType: 'name' })}
      {renderInput('email', 'Email', { keyboardType: 'email-address', autoComplete: 'email', textContentType: 'emailAddress' })}
      {renderInput('phone', 'Phone Number', { keyboardType: 'phone-pad', autoComplete: 'tel', textContentType: 'telephoneNumber' })}
      {renderInput('password', 'Password', {
        secure: securePassword,
        toggle: () => setSecurePassword(!securePassword),
        autoComplete: 'new-password',
        textContentType: 'newPassword',
      })}
      {renderInput('confirmPassword', 'Confirm password', {
        secure: secureConfirm,
        toggle: () => setSecureConfirm(!secureConfirm),
        autoComplete: 'new-password',
        textContentType: 'newPassword',
      })}

      {/* Register button */}
      <TouchableOpacity onPress={handleRegister} disabled={disabled} activeOpacity={0.85} style={{ marginTop: 8, marginBottom: 24 }}>
        <LinearGradient colors={disabled ? [colors.textTertiary, colors.textTertiary] : colors.primaryGrad} style={s.primaryBtn}>
          <Ionicons name="person-add-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={s.primaryBtnText}>{loading ? 'Creating Account...' : 'Register'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Divider */}
      <View style={s.dividerRow}>
        <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[s.dividerText, { color: colors.textTertiary }]}>Or</Text>
        <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      {/* Google sign-in */}
      <TouchableOpacity style={[s.googleBtn, { borderColor: colors.border, backgroundColor: colors.card }]} activeOpacity={0.8} onPress={onGoogleSignIn}>
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={[s.googleText, { color: colors.text }]}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Login link */}
      {onLogin && (
        <View style={s.linkRow}>
          <Text style={[s.linkLabel, { color: colors.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={[s.linkAction, { color: colors.primary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {},
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '500',
  },
  primaryBtn: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14B8A6',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontWeight: '500' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 32,
    gap: 10,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkLabel: { fontSize: 14 },
  linkAction: { fontSize: 14, fontWeight: '700' },
  inputIcon: { marginRight: 10 },
});

export default RegisterForm;
