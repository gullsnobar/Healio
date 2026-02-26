import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const RegisterForm = ({ onSubmit }) => {
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
        fullName: form.fullName.trim(),
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

  const renderField = (key, placeholder, icon, extra = {}) => (
    <View key={key}>
      <View style={[styles.inputWrapper, errors[key] && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={form[key]}
          onChangeText={(v) => update(key, v)}
          autoCapitalize={extra.autoCapitalize ?? 'none'}
          keyboardType={extra.keyboardType ?? 'default'}
          secureTextEntry={extra.secure}
          {...extra.props}
        />
        {extra.toggle && (
          <TouchableOpacity onPress={extra.toggle} style={styles.eyeBtn}>
            <Ionicons name={extra.secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join HEALIO to manage your health</Text>

      {renderField('fullName', 'Full Name', 'person-outline', { autoCapitalize: 'words' })}
      {renderField('email', 'Email Address', 'mail-outline', { keyboardType: 'email-address' })}
      {renderField('phone', 'Phone Number', 'call-outline', { keyboardType: 'phone-pad' })}
      {renderField('password', 'Password', 'lock-closed-outline', {
        secure: securePassword,
        toggle: () => setSecurePassword(!securePassword),
      })}
      {renderField('confirmPassword', 'Confirm Password', 'lock-closed-outline', {
        secure: secureConfirm,
        toggle: () => setSecureConfirm(!secureConfirm),
      })}

      <View style={styles.termsRow}>
        <Checkbox
          status={acceptTerms ? 'checked' : 'unchecked'}
          onPress={() => {
            setAcceptTerms(!acceptTerms);
            if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
          }}
          color={PRIMARY}
        />
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.registerBtn}
        buttonColor={PRIMARY}
        textColor="#fff"
        contentStyle={styles.registerBtnContent}
      >
        Register
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#e74c3c',
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
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  termsLink: {
    color: PRIMARY,
    fontWeight: '600',
  },
  registerBtn: {
    borderRadius: 12,
    marginTop: 20,
  },
  registerBtnContent: {
    height: 50,
  },
});

export default RegisterForm;
