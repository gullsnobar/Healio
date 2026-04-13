import React, { useState, useEffect } from 'react';
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
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';
import GoogleIcon from '../common/GoogleIcon';

const LoginForm = ({ onSubmit, onForgotPassword, onRegister, onGoogleSignIn }) => {
  const { colors, isDark } = useAppTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Override Chrome's autofill background (which ignores normal CSS) via box-shadow trick
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const styleId = 'healio-autofill-override';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    const bg = isDark ? '#334155' : '#FFFFFF';
    const fg = isDark ? '#E2E8F0' : '#0F172A';
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px ${bg} inset !important;
        -webkit-text-fill-color: ${fg} !important;
        caret-color: ${fg};
      }
    `;
  }, [isDark]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await onSubmit?.({ identifier: identifier.trim(), password });
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !identifier.trim() || !password.trim();

  return (
    <View style={s.container}>
      {/* Email / Phone */}
      <View style={[s.inputWrap, { backgroundColor: isDark ? colors.cardAlt : colors.card, borderColor: colors.inputBorder }, focusedField === 'id' && { borderColor: colors.primary, backgroundColor: isDark ? colors.card : colors.primaryLight }]}>
        <Ionicons name="mail-outline" size={20} color={focusedField === 'id' ? colors.primary : colors.textTertiary} style={s.inputIcon} />
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Enter your email"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          nativeID="login-email"
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
          onFocus={() => setFocusedField('id')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Password */}
      <View style={[s.inputWrap, { backgroundColor: isDark ? colors.cardAlt : colors.card, borderColor: colors.inputBorder }, focusedField === 'pw' && { borderColor: colors.primary, backgroundColor: isDark ? colors.card : colors.primaryLight }]}>
        <Ionicons name="lock-closed-outline" size={20} color={focusedField === 'pw' ? colors.primary : colors.textTertiary} style={s.inputIcon} />
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Enter your password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureEntry}
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          nativeID="login-password"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedField('pw')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} style={s.eyeBtn}>
          <Ionicons name={secureEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity onPress={onForgotPassword} style={s.forgotBtn}>
        <Text style={[s.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <Button
        variant="primary"
        size="large"
        icon="log-in-outline"
        onPress={handleLogin}
        loading={loading}
        disabled={disabled}
        colors={colors}
        style={{ marginBottom: 24 }}
      >
        Login
      </Button>

      {/* Divider */}
      <View style={s.dividerRow}>
        <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[s.dividerText, { color: colors.textTertiary }]}>Or</Text>
        <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      {/* Google sign-in */}
      <Button
        variant="outline"
        size="large"
        onPress={onGoogleSignIn}
        colors={colors}
        style={{ marginBottom: 32 }}
      >
        <GoogleIcon size={18} style={{ marginRight: 6 }} />
        <Text style={[{ color: colors.text, fontSize: 15, fontWeight: '600' }]}>Continue with Google</Text>
      </Button>

      {/* Register link */}
      <View style={s.linkRow}>
        <Text style={[s.linkLabel, { color: colors.textSecondary }]}>Don't have an account? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={[s.linkAction, { color: colors.primary }]}>Register</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
    borderWidth: 1,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.2,
    height: '100%',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  eyeBtn: { padding: 8 },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontWeight: '500' },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkLabel: { fontSize: 14 },
  linkAction: { fontSize: 14, fontWeight: '700' },
  inputIcon: { marginRight: 10 },
});

export default LoginForm;
