import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect, G, Ellipse, Line, Polyline } from 'react-native-svg';
import { useAppTheme } from '../../styles/ThemeContext';

const { width } = Dimensions.get('window');

/* ── Inline pill + clock illustration (enhanced hero) ── */
const HeroIllustration = () => {
  const { colors: c } = useAppTheme();
  return (
  <View style={ill.wrap}>
    <View style={ill.glowOuter}>
      <Svg width={240} height={240} viewBox="0 0 240 240">
        {/* Outer glow ring */}
        <Circle cx="120" cy="120" r="110" fill="#E0F2F1" opacity={0.5} />
        <Circle cx="120" cy="120" r="95" fill="#E0F2F1" />
        {/* Clock body */}
        <Circle cx="120" cy="120" r="80" fill="#FFFFFF" stroke={c.primaryDark} strokeWidth="3.5" />
        {/* Clock ticks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
          const rad = (a * Math.PI) / 180;
          const x1 = 120 + 65 * Math.sin(rad);
          const y1 = 120 - 65 * Math.cos(rad);
          const x2 = 120 + 72 * Math.sin(rad);
          const y2 = 120 - 72 * Math.cos(rad);
          return <Path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke={c.primaryDark} strokeWidth={i%3===0?3:1.5} strokeLinecap="round" />;
        })}
        {/* Hour hand */}
        <Path d="M120,120 L120,70" stroke={c.primaryDark} strokeWidth="4" strokeLinecap="round" />
        {/* Minute hand */}
        <Path d="M120,120 L152,100" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        {/* Center dot */}
        <Circle cx="120" cy="120" r="5" fill={c.primaryDark} />
        {/* Check badge (top-right) */}
        <Circle cx="180" cy="55" r="22" fill="#10B981" />
        <Circle cx="180" cy="55" r="20" fill="#10B981" stroke="#FFF" strokeWidth="2" />
        <Path d="M170,55 L177,62 L191,48" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Heart icon (top-left) */}
        <Circle cx="55" cy="50" r="18" fill="#EF4444" opacity={0.15} />
        <Path d="M55,58 C55,58 44,50 44,44 C44,40 47,37 51,37 C53.5,37 55,39 55,39 C55,39 56.5,37 59,37 C63,37 66,40 66,44 C66,50 55,58 55,58Z" fill="#EF4444" />
        {/* Pill capsule (bottom-left, larger) */}
        <G transform="translate(30,170) rotate(-30)">
          <Rect x="0" y="0" width="48" height="22" rx="11" fill="#F59E0B" />
          <Rect x="24" y="0" width="24" height="22" rx="11" fill="#FB923C" />
        </G>
        {/* Shield icon (bottom-right) */}
        <Circle cx="190" cy="180" r="16" fill="#6366F1" opacity={0.15} />
        <Path d="M190,168 L200,172 L200,180 C200,186 190,192 190,192 C190,192 180,186 180,180 L180,172 Z" fill="#6366F1" />
        <Path d="M186,180 L189,183 L195,177" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Heartbeat line across bottom */}
        <Polyline
          points="20,200 60,200 75,200 82,188 90,212 98,194 105,200 140,200 160,200"
          stroke="#10B981"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
      </Svg>
    </View>
  </View>
  );
};
const ill = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 16 },
  glowOuter: { alignItems: 'center' },
});

/* ── Feature highlight row ── */
const FEATURES = [
  { icon: 'pill', label: 'Medications', color: '#14B8A6', bg: '#CCFBF1', lib: 'mci' },
  { icon: 'heart-pulse', label: 'Health', color: '#EF4444', bg: '#FEE2E2', lib: 'mci' },
  { icon: 'robot', label: 'AI Chat', color: '#6366F1', bg: '#E0E7FF', lib: 'mci' },
  { icon: 'chart-line', label: 'Analytics', color: '#F59E0B', bg: '#FEF3C7', lib: 'mci' },
];
const FeatureRow = ({ colors }) => (
  <View style={fr.row}>
    {FEATURES.map((f) => (
      <View key={f.label} style={fr.item}>
        <View style={[fr.iconWrap, { backgroundColor: f.bg }]}>
          <MaterialCommunityIcons name={f.icon} size={22} color={f.color} />
        </View>
        <Text style={[fr.label, { color: colors.textSecondary }]}>{f.label}</Text>
      </View>
    ))}
  </View>
);
const fr = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 24, marginBottom: 8 },
  item: { alignItems: 'center', width: 68 },
  iconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  label: { fontSize: 11, fontWeight: '600', color: '#64748B', textAlign: 'center' },
});

const WelcomeScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <Animated.View style={[s.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <HeroIllustration />

        <Text style={[s.welcomeLabel, { color: colors.secondary }]}>Welcome To</Text>
        <Text style={[s.brandName, { color: colors.primaryDark }]}>HEALIO</Text>
        <Text style={[s.tagline, { color: colors.textSecondary }]}>Your personal assistant for managing{'\n'}your health & medication schedule.</Text>

        <FeatureRow colors={colors} />
      </Animated.View>

      <View style={s.btnGroup}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient colors={colors.primaryGrad} style={s.primaryBtn}>
            <Ionicons name="log-in-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={s.primaryBtnText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.outlineBtn, { borderColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Register')}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={[s.outlineBtnText, { color: colors.primary }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
    paddingHorizontal: 10,
  },
  btnGroup: {
    gap: 14,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14B8A6',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  outlineBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen;
