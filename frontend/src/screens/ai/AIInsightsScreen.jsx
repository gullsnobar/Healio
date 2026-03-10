import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import { fetchAIHealthInsights } from '../../redux/slices/aiInsightsSlice';

// ── Severity → visual config ──
const SEVERITY_MAP = {
  critical: { icon: 'alert-circle', label: 'Critical' },
  warning:  { icon: 'warning',      label: 'Warning' },
  info:     { icon: 'information-circle', label: 'Info' },
};

const CATEGORY_ICONS = {
  fitness:    'footsteps',
  diet:       'restaurant',
  hydration:  'water',
  sleep:      'moon',
  medication: 'medkit',
  general:    'heart',
};

// ─────────────────────────── Component ───────────────────────────
const AIInsightsScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { recommendations, dailySummary, weeklyFeedback, loading } = useSelector((s) => s.aiInsights);

  const load = useCallback(() => dispatch(fetchAIHealthInsights(7)), [dispatch]);
  useEffect(() => { load(); }, [load]);

  // ── Severity color lookup ──
  const sevColor = (sev) => {
    if (sev === 'critical') return colors.error;
    if (sev === 'warning') return colors.warning;
    return colors.primary;
  };
  const sevBg = (sev) => {
    if (sev === 'critical') return colors.errorLight;
    if (sev === 'warning') return colors.warningLight;
    return colors.primaryLight;
  };

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} colors={[colors.primary]} tintColor={colors.primary} />}
    >
      {/* ── Header ── */}
      <LinearGradient colors={isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark]} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="bulb" size={26} color="#FBBF24" />
        <Text style={s.headerTitle}>AI Health Insights</Text>
        <Text style={s.headerSub}>Personalized analysis from your health data</Text>
      </LinearGradient>

      <View style={s.body}>
        {/* ── Daily Summary Card ── */}
        {dailySummary && (
          <>
            <Text style={[s.section, { color: colors.text }]}>Daily Health Summary</Text>
            <View style={[s.summaryCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
              <View style={s.summaryRow}>
                <SummaryPill icon="footsteps" label="Steps" value={dailySummary.steps?.value?.toLocaleString() ?? '0'} status={dailySummary.steps?.status} colors={colors} />
                <SummaryPill icon="water" label="Water" value={`${dailySummary.water?.value ?? 0}ml`} status={dailySummary.water?.status} colors={colors} />
                <SummaryPill icon="moon" label="Sleep" value={`${dailySummary.sleep?.value ?? 0}h`} status={dailySummary.sleep?.status} colors={colors} />
              </View>
              <View style={s.summaryRow}>
                <SummaryPill icon="flame" label="Eaten" value={`${dailySummary.calories?.consumed ?? 0} kcal`} status={null} colors={colors} />
                <SummaryPill icon="bonfire" label="Burned" value={`${dailySummary.calories?.burned ?? 0} kcal`} status={null} colors={colors} />
                <SummaryPill icon="medkit" label="Meds" value={`${dailySummary.medication?.taken ?? 0}/${dailySummary.medication?.total ?? 0}`} status={dailySummary.medication?.adherence >= 80 ? 'achieved' : 'needs_improvement'} colors={colors} />
              </View>
              {/* Overall score */}
              <View style={[s.scoreRow, { borderTopColor: colors.border }]}>
                <Text style={[s.scoreLabel, { color: colors.textSecondary }]}>Today's Score</Text>
                <View style={[s.scoreBadge, { backgroundColor: dailySummary.overallScore >= 70 ? colors.successLight : dailySummary.overallScore >= 40 ? colors.warningLight : colors.errorLight }]}>
                  <Text style={[s.scoreVal, { color: dailySummary.overallScore >= 70 ? colors.success : dailySummary.overallScore >= 40 ? colors.warning : colors.error }]}>{dailySummary.overallScore}/100</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── AI Recommendations ── */}
        <Text style={[s.section, { color: colors.text }]}>Personalized Advice</Text>
        {recommendations.length === 0 && !loading && (
          <View style={[s.emptyCard, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-circle" size={40} color={colors.success} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>All looking good! No recommendations right now.</Text>
          </View>
        )}
        {recommendations.map((rec, i) => (
          <View key={i} style={[s.recCard, { backgroundColor: colors.card, borderLeftColor: sevColor(rec.severity), shadowColor: colors.shadow }]}>
            <View style={s.recHeader}>
              <View style={[s.recIconWrap, { backgroundColor: sevBg(rec.severity) }]}>
                <Ionicons name={CATEGORY_ICONS[rec.category] || 'heart'} size={18} color={sevColor(rec.severity)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.recTitle, { color: colors.text }]}>{rec.title}</Text>
                <View style={s.recMeta}>
                  <View style={[s.severityTag, { backgroundColor: sevBg(rec.severity) }]}>
                    <Ionicons name={SEVERITY_MAP[rec.severity]?.icon || 'information-circle'} size={11} color={sevColor(rec.severity)} />
                    <Text style={[s.severityText, { color: sevColor(rec.severity) }]}>{SEVERITY_MAP[rec.severity]?.label}</Text>
                  </View>
                  <Text style={[s.recCat, { color: colors.textTertiary }]}>{rec.category}</Text>
                </View>
              </View>
            </View>
            <Text style={[s.recDesc, { color: colors.textSecondary }]}>{rec.description}</Text>
            {rec.actionItems?.length > 0 && (
              <View style={[s.actionBox, { backgroundColor: sevBg(rec.severity) }]}> 
                {rec.actionItems.map((a, j) => (
                  <View key={j} style={s.actionRow}>
                    <Ionicons name="arrow-forward-circle" size={15} color={sevColor(rec.severity)} />
                    <Text style={[s.actionText, { color: colors.text }]}>{a.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* ── Weekly Activity Feedback ── */}
        {weeklyFeedback.length > 0 && (
          <>
            <Text style={[s.section, { color: colors.text }]}>Weekly Activity Feedback</Text>
            {weeklyFeedback.map((fb, i) => (
              <View key={i} style={[s.feedbackCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                <Ionicons
                  name={fb.sentiment === 'positive' ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={fb.sentiment === 'positive' ? colors.success : colors.warning}
                />
                <Text style={[s.feedbackText, { color: colors.textSecondary }]}>{fb.message}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

// ── Summary Pill sub-component ──
const SummaryPill = ({ icon, label, value, status, colors }) => {
  const statusColor = status === 'achieved' ? colors.success
    : status === 'on_track' ? colors.primary
    : status === 'needs_improvement' ? colors.warning
    : colors.textTertiary;

  return (
    <View style={sp.wrap}>
      <Ionicons name={icon} size={18} color={statusColor} />
      <Text style={[sp.val, { color: colors.text }]}>{value}</Text>
      <Text style={[sp.label, { color: colors.textTertiary }]}>{label}</Text>
    </View>
  );
};

// ─────────── Styles ───────────
const s = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 16, top: 18 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 },
  body: { paddingHorizontal: 16, paddingTop: 20 },

  section: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 8 },

  // Daily summary
  summaryCard: { borderRadius: 16, padding: 16, marginBottom: 20, ...Platform.select({ ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
  scoreLabel: { fontSize: 13, fontWeight: '600' },
  scoreBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  scoreVal: { fontSize: 14, fontWeight: '800' },

  // Recommendation cards
  recCard: { borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 4, ...Platform.select({ ios: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 2 } }) },
  recHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  recIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  recTitle: { fontSize: 14, fontWeight: '700' },
  recMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 8 },
  severityTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, gap: 3 },
  severityText: { fontSize: 10, fontWeight: '700' },
  recCat: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  recDesc: { fontSize: 12.5, lineHeight: 19, marginBottom: 8 },
  actionBox: { borderRadius: 10, padding: 10, gap: 6 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 12, fontWeight: '500', flex: 1 },

  // Empty state
  emptyCard: { alignItems: 'center', paddingVertical: 32, borderRadius: 16 },
  emptyText: { marginTop: 10, fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },

  // Weekly feedback
  feedbackCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 10, marginBottom: 10, ...Platform.select({ ios: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 1 } }) },
  feedbackText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});

const sp = StyleSheet.create({
  wrap: { alignItems: 'center', flex: 1 },
  val: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  label: { fontSize: 10, marginTop: 2, fontWeight: '500' },
});

export default AIInsightsScreen;
