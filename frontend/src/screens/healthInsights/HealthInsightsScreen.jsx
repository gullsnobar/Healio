import React, { useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import {
  fetchInsights, generateInsights, dismissInsight, completeInsightAction,
} from '../../redux/slices/healthInsightSlice';

const SEVERITY_CONFIG = {
  info: { icon: 'information-circle', color: '#3B82F6' },
  warning: { icon: 'warning', color: '#F59E0B' },
  critical: { icon: 'alert-circle', color: '#EF4444' },
};

const CATEGORY_ICON = {
  fitness: 'fitness',
  diet: 'restaurant',
  sleep: 'moon',
  hydration: 'water',
  medication: 'medkit',
  general: 'heart',
};

const SummaryCard = ({ label, value, icon, color, bg, colors }) => (
  <View style={[s.summaryCard, { backgroundColor: bg },
    Platform.select({
      ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 1 },
    })]}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[s.summaryVal, { color }]}>{value}</Text>
    <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const InsightCard = ({ insight, colors, onDismiss, onCompleteAction }) => {
  const sev = SEVERITY_CONFIG[insight.severity] || SEVERITY_CONFIG.info;
  const catIcon = CATEGORY_ICON[insight.category] || 'bulb';

  return (
    <View style={[s.insightCard, { backgroundColor: colors.card },
      Platform.select({
        ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
        android: { elevation: 3 },
      })]}>
      <View style={s.insightHeader}>
        <View style={[s.insightIcon, { backgroundColor: sev.color + '20' }]}>
          <Ionicons name={catIcon} size={18} color={sev.color} />
        </View>
        <View style={s.insightHeaderText}>
          <Text style={[s.insightTitle, { color: colors.text }]}>{insight.title}</Text>
          <Text style={[s.insightType, { color: sev.color }]}>
            {insight.type?.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDismiss(insight._id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <Text style={[s.insightDesc, { color: colors.textSecondary }]}>{insight.description}</Text>

      {insight.actionItems?.length > 0 && (
        <View style={s.actionList}>
          {insight.actionItems.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              style={[s.actionItem, { borderColor: colors.border }]}
              onPress={() => !action.isCompleted && onCompleteAction(insight._id, idx)}
            >
              <Ionicons
                name={action.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={action.isCompleted ? colors.success : colors.textTertiary}
              />
              <Text style={[
                s.actionText,
                { color: colors.text },
                action.isCompleted && { textDecorationLine: 'line-through', color: colors.textTertiary },
              ]}>
                {action.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const HealthInsightsScreen = () => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const { insights, summary, loading, generating } = useSelector((state) => state.healthInsight);

  const loadData = useCallback(() => { dispatch(fetchInsights()); }, [dispatch]);
  useEffect(() => { loadData(); }, [loadData]);

  const handleGenerate = () => dispatch(generateInsights());
  const handleDismiss = (id) => dispatch(dismissInsight(id));
  const handleCompleteAction = (id, actionIndex) => dispatch(completeInsightAction({ id, actionIndex }));

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
    >
      <LinearGradient
        colors={isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark]}
        style={s.header}
      >
        <Text style={s.headerTitle}>AI Health Insights</Text>
        <Text style={s.headerSub}>Personalised tips based on your activity</Text>
      </LinearGradient>

      <View style={s.body}>
        {/* Weekly Summary */}
        {summary && (
          <>
            <Text style={[s.sectionTitle, { color: colors.text }]}>This Week's Summary</Text>
            <View style={s.summaryGrid}>
              <SummaryCard label="Avg Steps" value={summary.avgSteps?.toLocaleString() || '0'} icon="walk" color={colors.fitnessSteps} bg={colors.fitnessStepsBg} colors={colors} />
              <SummaryCard label="Avg Sleep" value={`${summary.avgSleep || 0}h`} icon="moon" color={colors.fitnessSleep} bg={colors.fitnessSleepBg} colors={colors} />
              <SummaryCard label="Avg Water" value={`${summary.avgWater || 0}ml`} icon="water" color={colors.fitnessWater} bg={colors.fitnessWaterBg} colors={colors} />
              <SummaryCard label="Adherence" value={`${summary.adherenceRate || 0}%`} icon="medkit" color={colors.primary} bg={colors.primaryLight} colors={colors} />
            </View>
          </>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[s.generateBtn, { backgroundColor: colors.primary }]}
          onPress={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#FFF" />
              <Text style={s.generateText}>Generate New Insights</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Insights List */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>
          Your Insights {insights.length > 0 && `(${insights.length})`}
        </Text>

        {insights.length === 0 && !loading && (
          <View style={[s.empty, { backgroundColor: colors.card }]}>
            <Ionicons name="bulb-outline" size={48} color={colors.textTertiary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>
              No insights yet. Tap "Generate New Insights" to get personalised health tips.
            </Text>
          </View>
        )}

        {insights.map((insight) => (
          <InsightCard
            key={insight._id}
            insight={insight}
            colors={colors}
            onDismiss={handleDismiss}
            onCompleteAction={handleCompleteAction}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, minWidth: '44%', alignItems: 'center', paddingVertical: 14, borderRadius: 16 },
  summaryVal: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  summaryLabel: { fontSize: 10, marginTop: 2, fontWeight: '500' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8, marginBottom: 20 },
  generateText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  insightCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  insightIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightHeaderText: { flex: 1, marginLeft: 10 },
  insightTitle: { fontSize: 14, fontWeight: '700' },
  insightType: { fontSize: 9, fontWeight: '600', marginTop: 2 },
  insightDesc: { fontSize: 13, lineHeight: 19 },
  actionList: { marginTop: 12 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
  actionText: { fontSize: 13, flex: 1 },
  empty: { alignItems: 'center', padding: 32, borderRadius: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 12 },
});

export default HealthInsightsScreen;
