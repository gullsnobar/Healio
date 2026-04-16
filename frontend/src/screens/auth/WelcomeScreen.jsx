import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Dimensions, ScrollView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect, G, Polyline } from 'react-native-svg';
import { useAppTheme } from '../../styles/ThemeContext';

const { width } = Dimensions.get('window');

/* ── Hero illustration ── */
const HeroIllustration = () => {
  const { colors: c } = useAppTheme();
  return (
    <View style={ill.wrap}>
      <Svg width={160} height={160} viewBox="0 0 240 240">
        <Circle cx="120" cy="120" r="110" fill="#E0F2F1" opacity={0.4} />
        <Circle cx="120" cy="120" r="95" fill="#E0F2F1" />
        <Circle cx="120" cy="120" r="80" fill="#FFFFFF" stroke={c.primaryDark} strokeWidth="3.5" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
          const rad = (a * Math.PI) / 180;
          const x1 = 120 + 65 * Math.sin(rad); const y1 = 120 - 65 * Math.cos(rad);
          const x2 = 120 + 72 * Math.sin(rad); const y2 = 120 - 72 * Math.cos(rad);
          return <Path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke={c.primaryDark} strokeWidth={i%3===0?3:1.5} strokeLinecap="round" />;
        })}
        <Path d="M120,120 L120,70" stroke={c.primaryDark} strokeWidth="4" strokeLinecap="round" />
        <Path d="M120,120 L152,100" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        <Circle cx="120" cy="120" r="5" fill={c.primaryDark} />
        <Circle cx="180" cy="55" r="20" fill="#10B981" stroke="#FFF" strokeWidth="2" />
        <Path d="M170,55 L177,62 L191,48" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx="55" cy="50" r="18" fill="#EF4444" opacity={0.15} />
        <Path d="M55,58 C55,58 44,50 44,44 C44,40 47,37 51,37 C53.5,37 55,39 55,39 C55,39 56.5,37 59,37 C63,37 66,40 66,44 C66,50 55,58 55,58Z" fill="#EF4444" />
        <G transform="translate(30,170) rotate(-30)">
          <Rect x="0" y="0" width="48" height="22" rx="11" fill="#F59E0B" />
          <Rect x="24" y="0" width="24" height="22" rx="11" fill="#FB923C" />
        </G>
        <Circle cx="190" cy="180" r="16" fill="#6366F1" opacity={0.15} />
        <Path d="M190,168 L200,172 L200,180 C200,186 190,192 190,192 C190,192 180,186 180,180 L180,172 Z" fill="#6366F1" />
        <Path d="M186,180 L189,183 L195,177" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Polyline points="20,200 60,200 75,200 82,188 90,212 98,194 105,200 140,200 160,200" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      </Svg>
    </View>
  );
};
const ill = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 6 },
});

/* ── Feature row ── */
const FEATURES = [
  { icon: 'pill',        label: 'Medications', color: '#14B8A6', bg: '#CCFBF1' },
  { icon: 'heart-pulse', label: 'Health',      color: '#EF4444', bg: '#FEE2E2' },
  { icon: 'robot',       label: 'AI Chat',     color: '#6366F1', bg: '#E0E7FF' },
  { icon: 'chart-line',  label: 'Analytics',   color: '#F59E0B', bg: '#FEF3C7' },
];
const FeatureRow = ({ colors }) => (
  <View style={fr.row}>
    {FEATURES.map((f) => (
      <View key={f.label} style={fr.item}>
        <View style={[fr.iconWrap, { backgroundColor: f.bg }]}>
          <MaterialCommunityIcons name={f.icon} size={20} color={f.color} />
        </View>
        <Text style={[fr.label, { color: colors.textSecondary }]}>{f.label}</Text>
      </View>
    ))}
  </View>
);
const fr = StyleSheet.create({
  row:     { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20, marginBottom: 24 },
  item:    { alignItems: 'center', width: 64 },
  iconWrap:{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  label:   { fontSize: 10, fontWeight: '700', textAlign: 'center', letterSpacing: 0.2 },
});

const WelcomeScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // ✅ useNativeDriver: false on web (prevents "native animated module is missing" error)
    // ✅ useNativeDriver: true on native platforms for better performance
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 750, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(slideAnim, { toValue: 0, duration: 750, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[s.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <HeroIllustration />

          <Text style={[s.welcomeLabel, { color: colors.secondary }]}>Welcome To</Text>
          <Text style={[s.brandName, { color: colors.primaryDark }]}>HEALIO</Text>
          <Text style={[s.tagline, { color: colors.textSecondary }]}>
            Your personal assistant for managing{'\n'}your health & medication schedule.
          </Text>

          <FeatureRow colors={colors} />
        </Animated.View>

        {/* ── Buttons ── */}
        <View style={s.btnGroup}>

          {/* Login – teal gradient */}
          <TouchableOpacity activeOpacity={0.88} onPress={() => navigation.navigate('Login')}>
            <LinearGradient colors={['#14B8A6', '#0F766E']} style={s.btn}>
              <Ionicons name="log-in-outline" size={21} color="#fff" style={s.btnIcon} />
              <Text style={s.btnTextLight}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Create Account – emerald gradient, always high-contrast */}
          <TouchableOpacity activeOpacity={0.88} onPress={() => navigation.navigate('Register')}>
            <LinearGradient colors={['#22C55E', '#16A34A']} style={s.btn}>
              <Ionicons name="person-add-outline" size={21} color="#fff" style={s.btnIcon} />
              <Text style={s.btnTextLight}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[s.hint, { color: colors.textTertiary }]}>
            Free forever · No credit card required
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 48,
    paddingBottom: 36,
  },
  body: { alignItems: 'center' },
  welcomeLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
    paddingHorizontal: 8,
  },
  btnGroup: { gap: 13 },
  btn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  btnIcon:      { marginRight: 10 },
  btnTextLight: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  hint: { textAlign: 'center', fontSize: 12, marginTop: 2, letterSpacing: 0.2 },
});

export default WelcomeScreen;
