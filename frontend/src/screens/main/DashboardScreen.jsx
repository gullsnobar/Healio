import React from 'react';
import { ScrollView, StyleSheet, View, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import WeeklyProgressChart from '../../components/dashboard/WeeklyProgressChart';
import MonthlyProgressChart from '../../components/dashboard/MonthlyProgressChart';
import HealthScoreWidget from '../../components/dashboard/HealthScoreWidget';

const StatCard = ({ icon, label, value, color, bg }) => (
  <View style={[ds.statCard, { backgroundColor: bg }]}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[ds.statVal, { color }]}>{value}</Text>
    <Text style={ds.statLabel}>{label}</Text>
  </View>
);

const DashboardScreen = () => {
  const { dashboardData } = useSelector((state) => state.user);
  const score = dashboardData?.healthScore || 0;
  const meds = dashboardData?.medications || {};
  const fit = dashboardData?.fitness || {};

  return (
    <ScrollView style={ds.c} contentContainerStyle={ds.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#0D6560" />
      <LinearGradient colors={['#0D6560', '#0F766E']} style={ds.header}>
        <Text style={ds.headerTitle}>Analytics</Text>
        <Text style={ds.headerSub}>Track your health trends</Text>
      </LinearGradient>

      <View style={ds.body}>
        <HealthScoreWidget score={score} />

        {/* Quick Stats Grid */}
        <Text style={ds.sectionTitle}>Today at a Glance</Text>
        <View style={ds.statsGrid}>
          <StatCard icon="checkmark-circle" label="Taken"   value={meds.taken   ?? 0} color="#10B981" bg="#D1FAE5" />
          <StatCard icon="close-circle"     label="Missed"  value={meds.missed  ?? 0} color="#EF4444" bg="#FEE2E2" />
          <StatCard icon="footsteps-outline" label="Steps"  value={(fit.steps   ?? 0).toLocaleString()} color="#38BDF8" bg="#E0F2FE" />
          <StatCard icon="water-outline"    label="Water"  value={`${fit.water ?? 0}ml`}              color="#22D3EE" bg="#CFFAFE" />
        </View>

        <Text style={ds.sectionTitle}>Weekly Progress</Text>
        <WeeklyProgressChart data={dashboardData?.weeklyProgress} />

        <Text style={ds.sectionTitle}>Monthly Trend</Text>
        <MonthlyProgressChart data={dashboardData?.monthlyProgress} />
      </View>
    </ScrollView>
  );
};

const ds = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 12, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, minWidth: '44%', alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  statVal: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 3, fontWeight: '500' },
});
export default DashboardScreen;
