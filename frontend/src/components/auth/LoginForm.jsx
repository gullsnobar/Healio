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

const LoginForm = ({ onSubmit, onForgotPassword, onRegister, onGoogleSignIn }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
      <View style={[s.inputWrap, focusedField === 'id' && s.inputFocused]}>
        <TextInput
          style={s.input}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
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
      <View style={[s.inputWrap, focusedField === 'pw' && s.inputFocused]}>
        <TextInput
          style={s.input}
          placeholder="Enter your password"
          placeholderTextColor="#94A3B8"
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
          <Ionicons name={secureEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity onPress={onForgotPassword} style={s.forgotBtn}>
        <Text style={s.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity onPress={handleLogin} disabled={disabled} activeOpacity={0.85} style={{ marginBottom: 24 }}>
        <LinearGradient colors={disabled ? ['#94A3B8', '#94A3B8'] : [PRIMARY, PRIMARY_DARK]} style={s.primaryBtn}>
          <Text style={s.primaryBtnText}>{loading ? 'Signing in...' : 'Login'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Divider */}
      <View style={s.dividerRow}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>Or</Text>
        <View style={s.dividerLine} />
      </View>

      {/* Google sign-in */}
      <TouchableOpacity style={s.googleBtn} activeOpacity={0.8} onPress={onGoogleSignIn}>
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={s.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Register link */}
      <View style={s.linkRow}>
        <Text style={s.linkLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={s.linkAction}>Register</Text>
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '700',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    marginBottom: 32,
    gap: 10,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkLabel: { fontSize: 14, color: '#64748B' },
  linkAction: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});

export default LoginForm;
