import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons  } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect, G, Ellipse } from 'react-native-svg';

const { width } = Dimensions.get('window');

/* ── Inline pill + clock illustration (matches MediMinder hero) ── */
const HeroIllustration = () => (
  <View style={ill.wrap}>
    <Svg width={220} height={220} viewBox="0 0 220 220">
      {/* Clock body */}
      <Circle cx="110" cy="110" r="85" fill="#E0F2F1" />
      <Circle cx="110" cy="110" r="72" fill="#FFFFFF" stroke="#0F766E" strokeWidth="3" />
      {/* Clock ticks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 110 + 60 * Math.sin(rad);
        const y1 = 110 - 60 * Math.cos(rad);
        const x2 = 110 + 66 * Math.sin(rad);
        const y2 = 110 - 66 * Math.cos(rad);
        return <Path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke="#0F766E" strokeWidth={i%3===0?2.5:1.2} strokeLinecap="round" />;
      })}
      {/* Hour hand */}
      <Path d="M110,110 L110,65" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" />
      {/* Minute hand */}
      <Path d="M110,110 L140,95" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      {/* Center dot */}
      <Circle cx="110" cy="110" r="4" fill="#0F766E" />
      {/* Check badge */}
      <Circle cx="165" cy="55" r="18" fill="#10B981" />
      <Path d="M157,55 L163,61 L175,49" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Pill capsule (bottom-left) */}
      <G transform="translate(35,155) rotate(-30)">
        <Rect x="0" y="0" width="40" height="18" rx="9" fill="#F59E0B" />
        <Rect x="20" y="0" width="20" height="18" rx="0" fill="#FB923C" />
        <Rect x="20" y="0" width="20" height="18" rx="9" fill="#FB923C" />
      </G>
      {/* Small pill (top-left) */}
      <Ellipse cx="50" cy="55" rx="10" ry="6" fill="#38BDF8" transform="rotate(-20,50,55)" />
    </Svg>
  </View>
);
const ill = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 24 },
});

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Animated.View style={[s.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <HeroIllustration />

        <Text style={s.welcomeLabel}>Welcome To</Text>
        <Text style={s.brandName}>HEALIO</Text>
        <Text style={s.tagline}>Your personal assistant for managing{'\n'}your health & medication schedule.</Text>
      </Animated.View>

      <View style={s.btnGroup}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient colors={['#0F766E', '#0D6560']} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.outlineBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={s.outlineBtnText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 50,
  },
  body: {
    alignItems: 'center',
  },
  welcomeLabel: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  btnGroup: {
    gap: 14,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F766E',
    backgroundColor: 'transparent',
  },
  outlineBtnText: {
    color: '#0F766E',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen;
