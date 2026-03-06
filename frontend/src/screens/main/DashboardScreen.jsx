import React from 'react';
import { ScrollView, StyleSheet, View, Text, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import WeeklyProgressChart from '../../components/dashboard/WeeklyProgressChart';
import MonthlyProgressChart from '../../components/dashboard/MonthlyProgressChart';
import HealthScoreWidget from '../../components/dashboard/HealthScoreWidget';

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

const DashboardScreen = () => {
  const { colors, isDark } = useAppTheme();
  const { dashboardData } = useSelector((state) => state.user);
  const score = dashboardData?.healthScore || 0;
  const meds = dashboardData?.medications || {};
  const fit = dashboardData?.fitness || {};

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
          <StatCard icon="checkmark-circle" label="Taken"   value={meds.taken   ?? 0} color={colors.success}      bg={colors.successLight}     colors={colors} />
          <StatCard icon="close-circle"     label="Missed"  value={meds.missed  ?? 0} color={colors.error}        bg={colors.errorLight}       colors={colors} />
          <StatCard icon="footsteps-outline" label="Steps"  value={(fit.steps   ?? 0).toLocaleString()} color={colors.fitnessSteps} bg={colors.fitnessStepsBg}  colors={colors} />
          <StatCard icon="water-outline"    label="Water"  value={`${fit.water ?? 0}ml`}              color={colors.fitnessWater} bg={colors.fitnessWaterBg}  colors={colors} />
        </View>

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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, minWidth: '44%', alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  statVal: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, marginTop: 3, fontWeight: '500' },
});
export default DashboardScreen;
