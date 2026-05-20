import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const APP_VERSION = '1.0.0';
const BUILD = '2026.05';

const FEATURES = [
  { icon: 'medkit-outline', label: 'Medication Reminders', color: '#14B8A6' },
  { icon: 'calendar-outline', label: 'Appointment Tracking', color: '#6366F1' },
  { icon: 'barbell-outline', label: 'Fitness Monitoring', color: '#F59E0B' },
  { icon: 'flask-outline', label: 'Lab Report Analysis', color: '#EC4899' },
  { icon: 'people-outline', label: 'Trusted Contacts', color: '#F97316' },
  { icon: 'analytics-outline', label: 'Health Insights', color: '#0EA5E9' },
];

const TEAM = [
  { name: 'Department of Information Sciences', role: 'University of Education, Lahore' },
];

const LINKS = [
  { icon: 'mail-outline', label: 'Contact Support', url: 'mailto:support@healio.app', color: '#6366F1' },
  { icon: 'shield-checkmark-outline', label: 'Privacy Policy', url: null, color: '#14B8A6' },
  { icon: 'document-text-outline', label: 'Terms of Service', url: null, color: '#F59E0B' },
];

const AboutScreen = () => {
  const { colors, isDark } = useAppTheme();
  const { user } = useSelector((state) => state.auth);

  return (
    <ScrollView
      style={[s.c, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Gradient Banner ── */}
      <LinearGradient
        colors={isDark ? [colors.primary + 'DD', colors.primary + '77'] : [colors.primary, colors.primary + 'BB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        {/* App icon circle */}
        <View style={s.appIconWrap}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={s.appIcon}
          >
            <Ionicons name="heart-circle" size={44} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={s.heroAppName}>MR & FT</Text>
        <Text style={s.heroTagline}>Your Personal Health Companion</Text>

        {/* Version badge */}
        <View style={s.versionBadge}>
          <Ionicons name="sparkles" size={12} color="rgba(255,255,255,0.9)" />
          <Text style={s.versionText}>Version {APP_VERSION} • Build {BUILD}</Text>
        </View>
      </LinearGradient>

      {/* ── About Card ── */}
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={s.cardHeader}>
          <View style={[s.cardIconBox, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[s.cardTitle, { color: colors.text }]}>About the App</Text>
        </View>
        <Text style={[s.aboutText, { color: colors.textSecondary }]}>
          MR & FT is an all-in-one health management platform designed to help you track medications,
          appointments, fitness goals, and lab reports — all in one beautiful, intuitive app.
        </Text>
      </View>

      {/* ── Features Grid ── */}
      <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>FEATURES</Text>
      <View style={s.featuresGrid}>
        {FEATURES.map((f) => (
          <View key={f.label} style={[s.featureChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[s.featureIconBox, { backgroundColor: f.color + '18' }]}>
              <Ionicons name={f.icon} size={20} color={f.color} />
            </View>
            <Text style={[s.featureLabel, { color: colors.text }]}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Developer Card ── */}
      <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>DEVELOPED BY</Text>
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {TEAM.map((member) => (
          <View key={member.name} style={s.teamRow}>
            <View style={[s.teamIconBox, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="school-outline" size={22} color={colors.primary} />
            </View>
            <View style={s.teamText}>
              <Text style={[s.teamName, { color: colors.text }]}>{member.name}</Text>
              <Text style={[s.teamRole, { color: colors.textTertiary }]}>{member.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Links ── */}
      <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>RESOURCES</Text>
      <View style={[s.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {LINKS.map((link, i) => (
          <TouchableOpacity
            key={link.label}
            style={[s.linkRow, i < LINKS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
            onPress={() => {
              if (link.url) Linking.openURL(link.url);
              else Alert.alert('Coming Soon', `${link.label} is currently being updated and will be available shortly.`);
            }}
            activeOpacity={0.7}
          >
            <View style={[s.linkIconBox, { backgroundColor: link.color + '18' }]}>
              <Ionicons name={link.icon} size={18} color={link.color} />
            </View>
            <Text style={[s.linkLabel, { color: colors.text }]}>{link.label}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Copyright Footer ── */}
      <View style={s.footer}>
        <Ionicons name="heart" size={14} color={colors.primary} />
        <Text style={[s.footerText, { color: colors.textTertiary }]}>
          Made with care for your health
        </Text>
      </View>
      <Text style={[s.copyright, { color: colors.textTertiary }]}>
        © 2026 MR & FT. All rights reserved.
      </Text>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 48 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  appIconWrap: { marginBottom: 16 },
  appIcon: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroAppName: {
    fontSize: IS_SMALL ? 30 : 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  heroTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  versionText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginHorizontal: IS_SMALL ? 16 : 20,
    marginBottom: 10,
    marginTop: 24,
  },

  // Card
  card: {
    marginHorizontal: IS_SMALL ? 16 : 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  aboutText: { fontSize: 14, lineHeight: 22 },

  // Features grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: IS_SMALL ? 16 : 20,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: (SCREEN_W - (IS_SMALL ? 52 : 60)) / 2,
  },
  featureIconBox: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { fontSize: 12, fontWeight: '600', flex: 1 },

  // Team
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  teamIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  teamText: { flex: 1 },
  teamName: { fontSize: 15, fontWeight: '700' },
  teamRole: { fontSize: 12, marginTop: 3 },

  // Links menu
  menuCard: {
    marginHorizontal: IS_SMALL ? 16 : 20,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  linkIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  // Footer
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32 },
  footerText: { fontSize: 13, fontWeight: '500' },
  copyright: { textAlign: 'center', fontSize: 11, marginTop: 6, marginBottom: 8 },
});

export default AboutScreen;
