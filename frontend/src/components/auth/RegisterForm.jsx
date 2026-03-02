import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#4A90D9';
const PRIMARY_DARK = '#3A7BC8';

const RegisterForm = ({ onSubmit, onLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) errs.terms = 'You must accept the terms';
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

  const renderField = (key, placeholder, icon, extra = {}) => {
    const isFocused = focusedField === key;
    const hasError = !!errors[key];
    return (
      <View key={key} style={{ marginBottom: hasError ? 2 : 16 }}>
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputError,
        ]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={hasError ? '#EF4444' : isFocused ? PRIMARY : '#9CA3AF'}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#b0b0b0"
            value={form[key]}
            onChangeText={(v) => update(key, v)}
            autoCapitalize={extra.autoCapitalize ?? 'none'}
            keyboardType={extra.keyboardType ?? 'default'}
            secureTextEntry={extra.secure}
            onFocus={() => setFocusedField(key)}
            onBlur={() => setFocusedField(null)}
            {...extra.props}
          />
          {extra.toggle && (
            <TouchableOpacity onPress={extra.toggle} style={styles.eyeBtn}>
              <Ionicons name={extra.secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        {hasError && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  };

  const canSubmit = form.fullName && form.email && form.phone && form.password && form.confirmPassword && acceptTerms;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join HEALIO to manage your health</Text>
      </View>

      {renderField('fullName', 'Full Name', 'person-outline', { autoCapitalize: 'words' })}
      {renderField('email', 'Email Address', 'mail-outline', { keyboardType: 'email-address' })}
      {renderField('phone', 'Phone Number', 'call-outline', { keyboardType: 'phone-pad' })}
      {renderField('password', 'Password', 'lock-closed-outline', {
        secure: securePassword,
        toggle: () => setSecurePassword(!securePassword),
      })}
      {renderField('confirmPassword', 'Confirm Password', 'shield-checkmark-outline', {
        secure: secureConfirm,
        toggle: () => setSecureConfirm(!secureConfirm),
      })}

      {/* Terms */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setAcceptTerms(!acceptTerms);
          if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
        }}
        style={styles.termsRow}
      >
        <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
          {acceptTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
      {errors.terms && <Text style={[styles.errorText, { marginLeft: 36 }]}>{errors.terms}</Text>}

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading || !canSubmit}
        activeOpacity={0.85}
        style={[styles.registerBtnOuter, (loading || !canSubmit) && styles.registerBtnDisabled]}
      >
        <LinearGradient
          colors={loading || !canSubmit ? ['#B0C4DE', '#A0B8D0'] : [PRIMARY, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.registerBtnGradient}
        >
          {loading ? (
            <Text style={styles.registerBtnText}>Creating Account...</Text>
          ) : (
            <>
              <Text style={styles.registerBtnText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Login link */}
      {onLogin && (
        <>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1B2332',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8e8e9e',
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#e8edf2',
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
  inputError: {
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.08,
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 4,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsLink: {
    color: PRIMARY,
    fontWeight: '700',
  },
  registerBtnOuter: {
    borderRadius: 14,
    marginTop: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  registerBtnDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  registerBtnGradient: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8edf2',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#a0a0b0',
    fontWeight: '600',
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLabel: {
    fontSize: 14,
    color: '#8e8e9e',
  },
  loginLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },
});

export default RegisterForm;
