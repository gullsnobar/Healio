import React from 'react';
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import ThemeToggle from '../../components/common/ThemeToggle';

/**
 * AppearanceScreen – full theme settings page.
 * Lets users pick light, dark, or system-default mode
 * and see a live preview of their selection.
 */
const AppearanceScreen = () => {
  const { colors, isDark, mode, setScheme } = useAppTheme();

  const modeLabel = mode === 'system' ? 'System Default' : mode === 'dark' ? 'Dark' : 'Light';

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.background }]} contentContainerStyle={s.content}>
      {/* Mode selector */}
      <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
      <View style={[s.card, { backgroundColor: colors.card },
        Platform.select({
          ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
          android: { elevation: 2 },
        })]}>
        <ThemeToggle variant="full" />
      </View>

      {/* Current mode info */}
      <Text style={[s.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>CURRENT MODE</Text>
      <View style={[s.card, { backgroundColor: colors.card },
        Platform.select({
          ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
          android: { elevation: 2 },
        })]}>
        <View style={s.infoRow}>
          <View style={[s.infoIcon, { backgroundColor: isDark ? '#312E81' : '#EDE9FE' }]}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={isDark ? '#818CF8' : '#F59E0B'} />
          </View>
          <View style={s.infoText}>
            <Text style={[s.infoLabel, { color: colors.text }]}>{modeLabel}</Text>
            <Text style={[s.infoDesc, { color: colors.textTertiary }]}>
              {mode === 'system'
                ? `Following your device setting (currently ${isDark ? 'dark' : 'light'})`
                : `Manually set to ${mode} mode`}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick options list */}
      <Text style={[s.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>OPTIONS</Text>
      <View style={[s.card, { backgroundColor: colors.card, padding: 0 },
        Platform.select({
          ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
          android: { elevation: 2 },
        })]}>
        {[
          { key: 'light', icon: 'sunny-outline', label: 'Light Mode', desc: 'Classic bright interface' },
          { key: 'dark', icon: 'moon-outline', label: 'Dark Mode', desc: 'Easier on the eyes at night' },
          { key: 'system', icon: 'phone-portrait-outline', label: 'System Default', desc: 'Follows your device settings' },
        ].map((opt, i) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              s.optionRow,
              i < 2 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            ]}
            onPress={() => setScheme(opt.key)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: mode === opt.key }}
          >
            <View style={[s.optIcon, { backgroundColor: mode === opt.key ? colors.primaryLight : colors.cardAlt }]}>
              <Ionicons name={opt.icon} size={20} color={mode === opt.key ? colors.primary : colors.textTertiary} />
            </View>
            <View style={s.optText}>
              <Text style={[s.optLabel, { color: colors.text }]}>{opt.label}</Text>
              <Text style={[s.optDesc, { color: colors.textTertiary }]}>{opt.desc}</Text>
            </View>
            {mode === opt.key && (
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Preview card */}
      <Text style={[s.sectionTitle, { color: colors.textSecondary, marginTop: 28 }]}>PREVIEW</Text>
      <View style={[s.previewCard, { backgroundColor: colors.card },
        Platform.select({
          ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
          android: { elevation: 2 },
        })]}>
        <View style={s.previewHeader}>
          <View style={[s.previewDot, { backgroundColor: colors.primary }]} />
          <Text style={[s.previewTitle, { color: colors.text }]}>Sample Card</Text>
        </View>
        <Text style={[s.previewBody, { color: colors.textSecondary }]}>
          This is how cards and text look in the current theme. Colors, contrast, and surfaces adapt automatically.
        </Text>
        <View style={s.previewBtnRow}>
          <View style={[s.previewBtn, { backgroundColor: colors.primary }]}>
            <Text style={s.previewBtnText}>Primary</Text>
          </View>
          <View style={[s.previewBtnOutline, { borderColor: colors.primary }]}>
            <Text style={[s.previewBtnOutlineText, { color: colors.primary }]}>Outline</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 10, paddingLeft: 4 },

  card: { borderRadius: 16, padding: 16, marginBottom: 4 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  infoIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 16, fontWeight: '700' },
  infoDesc: { fontSize: 13, marginTop: 2 },

  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  optIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optText: { flex: 1 },
  optLabel: { fontSize: 15, fontWeight: '600' },
  optDesc: { fontSize: 12, marginTop: 2 },

  previewCard: { borderRadius: 16, padding: 20, marginBottom: 4 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  previewDot: { width: 10, height: 10, borderRadius: 5 },
  previewTitle: { fontSize: 16, fontWeight: '700' },
  previewBody: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  previewBtnRow: { flexDirection: 'row', gap: 12 },
  previewBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  previewBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  previewBtnOutline: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  previewBtnOutlineText: { fontSize: 14, fontWeight: '600' },
});

export default AppearanceScreen;
