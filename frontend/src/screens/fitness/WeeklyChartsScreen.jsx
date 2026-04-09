import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import { fetchWeeklyChart } from '../../redux/slices/fitnessSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;

const BarChart = ({ labels, data, color, bgColor, maxVal, unit, colors }) => {
  const max = maxVal || Math.max(...data, 1);
  return (
    <View style={cs.chartWrap}>
      <View style={cs.bars}>
        {data.map((v, i) => (
          <View key={i} style={cs.barCol}>
            <Text style={[cs.barVal, { color: colors.textTertiary }]}>
              {v > 0 ? (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v) : ''}
            </Text>
            <View style={[cs.barTrack, { backgroundColor: bgColor }]}>
              <View style={[cs.barFill, { height: `${Math.max((v / max) * 100, 3)}%`, backgroundColor: color }]} />
            </View>
            <Text style={[cs.barLabel, { color: colors.textTertiary }]}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const WeeklyChartsScreen = () => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const { weeklyChart } = useSelector((state) => state.fitness);
  const [activeTab, setActiveTab] = useState('steps');

  useEffect(() => { dispatch(fetchWeeklyChart()); }, [dispatch]);

  const chartData = weeklyChart?.data || {};
  const labels = chartData.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const tabs = [
    { key: 'steps', label: 'Steps', icon: 'walk', color: colors.fitnessSteps, bg: colors.fitnessStepsBg },
    { key: 'calories', label: 'Calories', icon: 'flame', color: colors.fitnessCal, bg: colors.fitnessCalBg },
    { key: 'sleep', label: 'Sleep', icon: 'moon', color: colors.fitnessSleep, bg: colors.fitnessSleepBg },
  ];

  const activeConfig = tabs.find((t) => t.key === activeTab);
  const values = chartData[activeTab]?.data || [0, 0, 0, 0, 0, 0, 0];
  const avg = values.length ? Math.round(values.reduce((a, v) => a + v, 0) / values.filter((v) => v > 0).length || 1) : 0;
  const total = values.reduce((a, v) => a + v, 0);

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.background }]} contentContainerStyle={s.content}>
      <LinearGradient
        colors={isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark]}
        style={s.header}
      >
        <Text style={s.headerTitle}>Weekly Progress</Text>
        <Text style={s.headerSub}>Your 7-day activity overview</Text>
      </LinearGradient>

      <View style={s.body}>
        {/* Tab Selector */}
        <View style={[s.tabRow, { backgroundColor: colors.card }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[s.tab, activeTab === tab.key && { backgroundColor: tab.color + '20' }]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons name={tab.icon} size={16} color={activeTab === tab.key ? tab.color : colors.textTertiary} />
              <Text style={[s.tabText, { color: activeTab === tab.key ? tab.color : colors.textTertiary }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
          <View style={[s.statBox, { backgroundColor: colors.card },
            Platform.select({
              ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
              android: { elevation: 1 },
            })]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Average</Text>
            <Text style={[s.statVal, { color: activeConfig.color }]}>
              {activeTab === 'steps' ? avg.toLocaleString() : avg}
            </Text>
          </View>
          <View style={[s.statBox, { backgroundColor: colors.card },
            Platform.select({
              ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
              android: { elevation: 1 },
            })]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[s.statVal, { color: activeConfig.color }]}>
              {activeTab === 'steps' ? total.toLocaleString() : total}
            </Text>
          </View>
          <View style={[s.statBox, { backgroundColor: colors.card },
            Platform.select({
              ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
              android: { elevation: 1 },
            })]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Best</Text>
            <Text style={[s.statVal, { color: activeConfig.color }]}>
              {activeTab === 'steps' ? Math.max(...values).toLocaleString() : Math.max(...values)}
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={[s.chartCard, { backgroundColor: colors.card },
          Platform.select({
            ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
            android: { elevation: 4 },
          })]}>
          <BarChart
            labels={labels}
            data={values}
            color={activeConfig.color}
            bgColor={activeConfig.bg}
            colors={colors}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const cs = StyleSheet.create({
  chartWrap: { paddingVertical: 8 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: 6, justifyContent: 'space-between' },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barVal: { fontSize: 9, marginBottom: 3, fontWeight: '600' },
  barTrack: { width: '80%', height: '75%', justifyContent: 'flex-end', borderRadius: 8, overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 8 },
  barLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
});

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  tabRow: { flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: 10 },
  tabText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14 },
  statLabel: { fontSize: 10, fontWeight: '500', marginBottom: 4 },
  statVal: { fontSize: 16, fontWeight: '800' },
  chartCard: { borderRadius: 20, padding: 16 },
});

export default WeeklyChartsScreen;
