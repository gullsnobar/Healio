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
    const bg = isDark ? '#1E293B' : '#FFFFFF';
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
      <View style={[s.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }, focusedField === 'id' && { borderColor: colors.primary, backgroundColor: isDark ? colors.cardAlt : colors.primaryLight }]}>
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
      <View style={[s.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }, focusedField === 'pw' && { borderColor: colors.primary, backgroundColor: isDark ? colors.cardAlt : colors.primaryLight }]}>
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
      <TouchableOpacity onPress={handleLogin} disabled={disabled} activeOpacity={0.85} style={{ marginBottom: 24 }}>
        <LinearGradient colors={disabled ? [colors.textTertiary, colors.textTertiary] : colors.primaryGrad} style={s.primaryBtn}>
          <Ionicons name="log-in-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={s.primaryBtnText}>{loading ? 'Signing in...' : 'Login'}</Text>
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
    borderWidth: 1.5,
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

export default LoginForm;
