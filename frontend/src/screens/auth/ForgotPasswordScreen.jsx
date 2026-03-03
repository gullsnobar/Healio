import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from '../../services/api/authAPI';

const PRIMARY = '#0F766E';
const PRIMARY_DARK = '#0D6560';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');
    if (!/\S+@\S+\.\S+/.test(email.trim())) return Alert.alert('Error', 'Please enter a valid email');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim());
      Alert.alert('Success', 'OTP sent to your email');
      navigation.navigate('OTP', { email: email.trim(), mode: 'reset' });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !email.trim();

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={s.title}>Forgot Password?</Text>
        <Text style={s.subtitle}>
          Don't worry! It occurs. Please enter the email address linked with your account.
        </Text>

        {/* Email input */}
        <View style={[s.inputWrap, focused && s.inputFocused]}>
          <TextInput
            style={s.input}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>

        {/* Send Code button */}
        <TouchableOpacity onPress={handleSubmit} disabled={disabled} activeOpacity={0.85} style={{ marginBottom: 32 }}>
          <LinearGradient colors={disabled ? ['#94A3B8', '#94A3B8'] : [PRIMARY, PRIMARY_DARK]} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>{loading ? 'Sending...' : 'Send Code'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Back to login */}
        <View style={s.linkRow}>
          <Text style={s.linkLabel}>Remember Password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.linkAction}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
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
    marginBottom: 32,
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
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkLabel: { fontSize: 14, color: '#64748B' },
  linkAction: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});

export default ForgotPasswordScreen;
