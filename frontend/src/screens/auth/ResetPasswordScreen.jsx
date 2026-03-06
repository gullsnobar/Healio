import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PasswordReset from '../../components/auth/PasswordReset';
import { authAPI } from '../../services/api/authAPI';
import { useAppTheme } from '../../styles/ThemeContext';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [loading, setLoading] = useState(false);
  const { colors, isDark } = useAppTheme();

  const handleSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, password });
      navigation.navigate('PasswordChanged');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[s.c, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <PasswordReset onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: {
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
});
export default ResetPasswordScreen;
