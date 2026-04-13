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
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../../components/common/Button';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { colors, isDark } = useAppTheme();

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
    <KeyboardAvoidingView style={[s.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={[s.title, { color: colors.text }]}>Forgot Password?</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>
          Don't worry! It occurs. Please enter the email address linked with your account.
        </Text>

        {/* Email input */}
        <View style={[s.inputWrap, { backgroundColor: isDark ? colors.cardAlt : colors.card, borderColor: focused ? colors.primary : colors.inputBorder }]}>
          <TextInput
            style={[s.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
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
        <Button
          variant="primary"
          size="large"
          icon="mail-check-outline"
          onPress={handleSubmit}
          loading={loading}
          disabled={disabled}
          colors={colors}
          style={{ marginBottom: 32 }}
        >
          Send Code
        </Button>

        {/* Back to login */}
        <View style={s.linkRow}>
          <Text style={[s.linkLabel, { color: colors.textSecondary }]}>Remember Password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[s.linkAction, { color: colors.primary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
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
    marginBottom: 32,
    borderWidth: 1,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.2,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkLabel: { fontSize: 14 },
  linkAction: { fontSize: 14, fontWeight: '700' },
});

export default ForgotPasswordScreen;
