import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const CATEGORY_ICONS = {
  fitness: 'walk', diet: 'restaurant', hydration: 'water',
  sleep: 'moon', medication: 'medkit', general: 'heart',
};

/**
 * Compact AI-insights preview card for the Analytics dashboard.
 * Shows the top 3 recommendations with severity badges.
 */
const AIHealthInsightsWidget = ({ recommendations = [], weeklyFeedback = [], onSeeAll }) => {
  const { colors } = useAppTheme();

  const sevColor = (sev) => sev === 'critical' ? colors.error : sev === 'warning' ? colors.warning : colors.primary;
  const sevBg = (sev) => sev === 'critical' ? colors.errorLight : sev === 'warning' ? colors.warningLight : colors.primaryLight;

  const top = recommendations.slice(0, 3);
  const hasData = top.length > 0 || weeklyFeedback.length > 0;

  if (!hasData) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Section header */}
      <View style={s.sectionRow}>
        <View style={s.sectionLeft}>
          <Ionicons name="bulb" size={17} color="#FBBF24" />
          <Text style={[s.sectionTitle, { color: colors.text }]}>AI Health Insights</Text>
        </View>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={[s.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Top recommendation cards */}
      {top.map((rec, i) => (
        <TouchableOpacity key={i} onPress={onSeeAll} activeOpacity={0.8}
          style={[s.card, { backgroundColor: colors.card, borderLeftColor: sevColor(rec.severity), shadowColor: colors.shadow }]}>
          <View style={[s.iconCircle, { backgroundColor: sevBg(rec.severity) }]}>
            <Ionicons name={CATEGORY_ICONS[rec.category] || 'heart'} size={16} color={sevColor(rec.severity)} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: colors.text }]} numberOfLines={1}>{rec.title}</Text>
            <Text style={[s.desc, { color: colors.textSecondary }]} numberOfLines={2}>{rec.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      ))}

      {/* Quick weekly feedback strip */}
      {weeklyFeedback.length > 0 && (
        <View style={[s.feedStrip, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          {weeklyFeedback.slice(0, 2).map((fb, i) => (
            <View key={i} style={s.feedRow}>
              <Ionicons
                name={fb.sentiment === 'positive' ? 'trending-up' : 'trending-down'}
                size={15}
                color={fb.sentiment === 'positive' ? colors.success : colors.warning}
              />
              <Text style={[s.feedText, { color: colors.textSecondary }]} numberOfLines={1}>{fb.message}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14,
    borderLeftWidth: 3, marginBottom: 8, gap: 10,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  iconCircle: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, fontWeight: '700' },
  desc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  feedStrip: {
    borderRadius: 12, padding: 12, gap: 8, marginTop: 4,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  feedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedText: { fontSize: 11.5, flex: 1 },
});

export default AIHealthInsightsWidget;
