import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import WeeklyProgressChart from '../../components/dashboard/WeeklyProgressChart';
import MonthlyProgressChart from '../../components/dashboard/MonthlyProgressChart';
import HealthScoreWidget from '../../components/dashboard/HealthScoreWidget';
import AIHealthInsightsWidget from '../../components/dashboard/AIHealthInsightsWidget';
import { fetchDashboardData } from '../../redux/slices/userSlice';
import { fetchAIHealthInsights } from '../../redux/slices/aiInsightsSlice';

const StatCard = ({ icon, label, value, color, bg, colors }) => (
  <View style={[ds.statCard, { backgroundColor: bg },
    Platform.select({
      ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 1 },
    })]}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[ds.statVal, { color }]}>{value}</Text>
    <Text style={[ds.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const DashboardScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.user);
  const { recommendations: aiRecs, weeklyFeedback: aiFeedback } = useSelector((state) => state.aiInsights);

  useEffect(() => { dispatch(fetchDashboardData()); dispatch(fetchAIHealthInsights(7)); }, []);

  const score = dashboardData?.healthScore || 0;
  const meds = dashboardData?.medications || {};
  const fit = dashboardData?.fitness || {};
  const meals = dashboardData?.mealSummary || {};
  const insights = dashboardData?.healthInsights || [];

  const doses = meds.todayDoses || [];
  const taken = doses.reduce((a, d) => a + (d.taken || 0), 0);
  const totalDoses = doses.reduce((a, d) => a + (d.total || 0), 0);
  const missed = totalDoses - taken;

  return (
    <ScrollView style={[ds.c, { backgroundColor: colors.background }]} contentContainerStyle={ds.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDeep} />
      <LinearGradient colors={isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark]} style={ds.header}>
        <Text style={ds.headerTitle}>Analytics</Text>
        <Text style={ds.headerSub}>Track your health trends</Text>
      </LinearGradient>

      <View style={ds.body}>
        <HealthScoreWidget score={score} />

        <Text style={[ds.sectionTitle, { color: colors.text }]}>Today at a Glance</Text>
        <View style={ds.statsGrid}>
          <StatCard icon="checkmark-circle" label="Taken"   value={taken}   color={colors.success}      bg={colors.successLight}     colors={colors} />
          <StatCard icon="close-circle"     label="Missed"  value={missed}  color={colors.error}        bg={colors.errorLight}       colors={colors} />
          <StatCard icon="footsteps-outline" label="Steps"  value={(fit.steps   ?? 0).toLocaleString()} color={colors.fitnessSteps} bg={colors.fitnessStepsBg}  colors={colors} />
          <StatCard icon="water-outline"    label="Water"  value={`${fit.water ?? 0}ml`}              color={colors.fitnessWater} bg={colors.fitnessWaterBg}  colors={colors} />
        </View>

        {/* Meal Summary */}
        <Text style={[ds.sectionTitle, { color: colors.text }]}>Today's Nutrition</Text>
        <View style={[ds.mealCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={ds.mealRow}>
            <View style={ds.mealStat}>
              <Ionicons name="flame-outline" size={20} color={colors.warning} />
              <Text style={[ds.mealVal, { color: colors.text }]}>{meals.totalCalories || 0}</Text>
              <Text style={[ds.mealLabel, { color: colors.textSecondary }]}>Calories</Text>
            </View>
            <View style={ds.mealStat}>
              <Ionicons name="restaurant-outline" size={20} color={colors.success} />
              <Text style={[ds.mealVal, { color: colors.text }]}>{meals.meals || 0}</Text>
              <Text style={[ds.mealLabel, { color: colors.textSecondary }]}>Meals</Text>
            </View>
            <View style={ds.mealStat}>
              <Ionicons name="barbell-outline" size={20} color={colors.primary} />
              <Text style={[ds.mealVal, { color: colors.text }]}>{meals.protein || 0}g</Text>
              <Text style={[ds.mealLabel, { color: colors.textSecondary }]}>Protein</Text>
            </View>
          </View>
        </View>

        {/* Health Insights Preview */}
        {insights.length > 0 && (
          <>
            <View style={ds.sectionRow}>
              <Text style={[ds.sectionTitle, { color: colors.text }]}>Health Insights</Text>
              <TouchableOpacity onPress={() => navigation.navigate('HealthInsights')}>
                <Text style={[ds.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[ds.insightCard, { backgroundColor: colors.primaryLight || colors.card, borderLeftColor: colors.primary }]}
              onPress={() => navigation.navigate('HealthInsights')}
              activeOpacity={0.8}
            >
              <Ionicons name="bulb-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[ds.insightTitle, { color: colors.text }]}>{insights[0].title}</Text>
                <Text style={[ds.insightDesc, { color: colors.textSecondary }]} numberOfLines={2}>{insights[0].description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </>
        )}

        {/* AI Health Insights */}
        <AIHealthInsightsWidget
          recommendations={aiRecs}
          weeklyFeedback={aiFeedback}
          onSeeAll={() => navigation.navigate('AIInsights')}
        />

        <Text style={[ds.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
        <WeeklyProgressChart data={dashboardData?.weeklyProgress} />

        <Text style={[ds.sectionTitle, { color: colors.text }]}>Monthly Trend</Text>
        <MonthlyProgressChart data={dashboardData?.monthlyProgress} />
      </View>
    </ScrollView>
  );
};

const ds = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, minWidth: '44%', alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  statVal: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, marginTop: 3, fontWeight: '500' },
  mealCard: { borderRadius: 16, padding: 16, marginBottom: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-around' },
  mealStat: { alignItems: 'center', gap: 4 },
  mealVal: { fontSize: 18, fontWeight: '800' },
  mealLabel: { fontSize: 11, fontWeight: '500' },
  insightCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderLeftWidth: 4, marginBottom: 20 },
  insightTitle: { fontSize: 13, fontWeight: '700' },
  insightDesc: { fontSize: 11, marginTop: 2, lineHeight: 16 },
});
export default DashboardScreen;
