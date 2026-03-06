import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';

const PasswordChangedScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={s.content}>
        {/* Checkmark circle */}
        <Animated.View style={[s.checkCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={48} color="#FFF" />
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: 'center' }}>
          <Text style={[s.title, { color: colors.text }]}>Password Changed!</Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>
            Your password has been changed successfully.
          </Text>
        </Animated.View>
      </View>

      {/* Back to Login button */}
      <View style={s.bottom}>
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
          activeOpacity={0.85}
        >
          <LinearGradient colors={colors.primaryGrad} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>Back to Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bottom: {
    paddingBottom: 48,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 12,
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
});

export default PasswordChangedScreen;
