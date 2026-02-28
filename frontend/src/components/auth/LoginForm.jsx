import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#4A90D9';
const PRIMARY_DARK = '#3A7BC8';

const LoginForm = ({ onSubmit, onForgotPassword, onRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const isEmail = /\S+@\S+\.\S+/.test(identifier.trim());

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await onSubmit?.({ identifier: identifier.trim(), password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your HEALIO account</Text>
      </View>

      {/* Identifier field – accepts email or phone */}
      <View style={[styles.inputWrapper, focusedField === 'identifier' && styles.inputWrapperFocused]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isEmail ? 'mail-outline' : 'person-outline'}
            size={20}
            color={focusedField === 'identifier' ? PRIMARY : '#999'}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email or phone number"
          placeholderTextColor="#b0b0b0"
          autoCapitalize="none"
          autoCorrect={false}
          value={identifier}
          onChangeText={setIdentifier}
          onFocus={() => setFocusedField('identifier')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Password */}
      <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={focusedField === 'password' ? PRIMARY : '#999'}
          />
        </View>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry={secureEntry}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} style={styles.eyeBtn}>
          <Ionicons name={secureEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading || !identifier.trim() || !password.trim()}
        activeOpacity={0.85}
        style={[styles.loginBtnOuter, (loading || !identifier.trim() || !password.trim()) && styles.loginBtnDisabled]}
      >
        <LinearGradient
          colors={loading || !identifier.trim() || !password.trim() ? ['#B0C4DE', '#A0B8D0'] : [PRIMARY, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.loginBtnGradient}
        >
          {loading ? (
            <Text style={styles.loginBtnText}>Signing in...</Text>
          ) : (
            <>
              <Text style={styles.loginBtnText}>Log In</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.registerRow}>
        <Text style={styles.registerLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a1a2e',
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
    marginBottom: 16,
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
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },
  eyeBtn: {
    padding: 10,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loginBtnOuter: {
    borderRadius: 14,
    marginBottom: 28,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loginBtnGradient: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLabel: {
    fontSize: 14,
    color: '#8e8e9e',
  },
  registerLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },
});

export default LoginForm;
