import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const LoginForm = ({ onSubmit, onForgotPassword, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await onSubmit?.({ email: email.trim(), password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your HEALIO account</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureEntry}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} style={styles.eyeBtn}>
          <Ionicons name={secureEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading || !email.trim() || !password.trim()}
        style={styles.loginBtn}
        buttonColor={PRIMARY}
        textColor="#fff"
        contentStyle={styles.loginBtnContent}
      >
        Log In
      </Button>

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
    padding: 24,
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
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    borderRadius: 12,
    marginBottom: 24,
  },
  loginBtnContent: {
    height: 50,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLabel: {
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
});

export default LoginForm;
