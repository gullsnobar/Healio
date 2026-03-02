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

const PRIMARY = '#4A90D9';
const PRIMARY_DARK = '#3A7BC8';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#6B7280" />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>

          {/* Icon */}
          <View style={s.iconWrap}>
            <View style={s.iconInner}>
              <Ionicons name="key-outline" size={38} color={PRIMARY} />
            </View>
          </View>

          <Text style={s.title}>Forgot Password?</Text>
          <Text style={s.subtitle}>
            No worries! Enter the email address linked to your account and we'll send you a reset code.
          </Text>

          {/* Email Input */}
          <View style={[s.inputWrapper, focusedField === 'email' && s.inputWrapperFocused]}>
            <View style={s.iconContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={focusedField === 'email' ? PRIMARY : '#9CA3AF'}
              />
            </View>
            <TextInput
              style={s.input}
              placeholder="Enter your email"
              placeholderTextColor="#b0b0b0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !email.trim()}
            activeOpacity={0.85}
            style={[s.btnOuter, (loading || !email.trim()) && s.btnDisabled]}
          >
            <LinearGradient
              colors={loading || !email.trim() ? ['#B0C4DE', '#A0B8D0'] : [PRIMARY, PRIMARY_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.btnGradient}
            >
              {loading ? (
                <Text style={s.btnText}>Sending...</Text>
              ) : (
                <>
                  <Ionicons name="send-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={s.btnText}>Send Reset Code</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to login link */}
          <View style={s.loginRow}>
            <Text style={s.loginLabel}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  iconWrap: {
    marginBottom: 20,
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
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e9e',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 4,
    marginBottom: 20,
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
  btnOuter: {
    borderRadius: 14,
    width: '100%',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
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
export default ForgotPasswordScreen;
