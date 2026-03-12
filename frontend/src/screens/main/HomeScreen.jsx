import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  ScrollView, StyleSheet, RefreshControl, View, Text, StatusBar,
  TouchableOpacity, FlatList, Dimensions, Animated, Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '../../styles/ThemeContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import { fetchDashboardData } from '../../redux/slices/userSlice';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;
const CARD_W = (SCREEN_W - (IS_SMALL ? 44 : 52)) / 2;

/* ─── date helpers ─── */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 3);
    return { key: d.toISOString(), date: d.getDate(), day: DAY_NAMES[d.getDay()], isToday: i === 3, fullDay: FULL_DAYS[d.getDay()] };
  });
};

/* ─── Quick Stat Card ─── */
const QuickStatCard = ({ icon, label, value, unit, color, bg, colors }) => (
  <View style={[st.statCard, { backgroundColor: colors.card }, Platform.select({
    ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
    android: { elevation: 2 },
  })]}>
    <View style={[st.statIconWrap, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={IS_SMALL ? 18 : 22} color={color} />
    </View>
    <Text style={[st.statValue, { color: colors.text }]}>{value}<Text style={[st.statUnit, { color: colors.textTertiary }]}> {unit}</Text></Text>
    <Text style={[st.statLabel, { color: colors.textTertiary }]}>{label}</Text>
  </View>
);

/* ─── Main HomeScreen ─── */
const HomeScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.split(' ')[0] || 'there';
  const [selectedDay, setSelectedDay] = useState(3);

  const days = useMemo(() => getDays(), []);
  const today = new Date();
  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => { dispatch(fetchDashboardData()); }, []);

  const medsTaken = dashboardData?.medications?.taken || 0;
  const medsTotal = (dashboardData?.medications?.taken || 0) + (dashboardData?.medications?.missed || 0) + (dashboardData?.medications?.pending || 0) || 0;
  const healthScore = dashboardData?.healthScore || 0;
  const fitness = dashboardData?.fitness || {};

  const renderDayItem = useCallback(({ item, index }) => {
    const active = index === selectedDay;
    return (
      <TouchableOpacity
        style={[st.dayItem, { backgroundColor: colors.card, borderColor: colors.border },
          active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
        onPress={() => setSelectedDay(index)} activeOpacity={0.7}>
        <Text style={[st.dayName, { color: colors.textTertiary }, active && st.dayNameActive]}>{item.day}</Text>
        <Text style={[st.dayDate, { color: colors.text }, active && st.dayDateActive]}>{item.date}</Text>
        {item.isToday && <View style={[st.todayDot, !active && { backgroundColor: colors.primary }]} />}
      </TouchableOpacity>
    );
  }, [selectedDay, colors]);

  return (
    <ScrollView style={[st.c, { backgroundColor: colors.background }]} contentContainerStyle={st.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchDashboardData())} tintColor={colors.primary} />}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={st.header}>
        <View style={st.headerLeft}>
          <View style={[st.brandPill, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="heart-pulse" size={18} color={colors.primary} />
          </View>
          <Text style={[st.brand, { color: colors.text }]}>HEALIO</Text>
        </View>
        <View style={st.headerRight}>
          <ThemeToggle variant="icon" size={20} />
          <TouchableOpacity style={[st.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}
            style={[st.avatarSmall, { backgroundColor: colors.primary }]}>
            <Text style={st.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting */}
      <View style={st.greetingSection}>
        <Text style={[st.greetingLabel, { color: colors.textTertiary }]}>{greeting} 👋</Text>
        <Text style={[st.greetingName, { color: colors.text }]}>{firstName}</Text>
      </View>

      {/* Hero Health Score Card */}
      <LinearGradient colors={isDark ? ['#1E293B', '#334155'] : ['#0F766E', '#14B8A6']}
        style={st.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={st.heroRow}>
          <View style={st.heroLeft}>
            <Text style={st.heroLabel}>Health Score</Text>
            <Text style={st.heroScore}>{healthScore}<Text style={st.heroMax}>/100</Text></Text>
            <View style={st.heroGradeRow}>
              <View style={[st.heroDot, { backgroundColor: healthScore >= 80 ? '#22C55E' : healthScore >= 50 ? '#F59E0B' : '#EF4444' }]} />
              <Text style={st.heroGradeText}>{healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Needs Attention'}</Text>
            </View>
            <View style={st.heroTrack}><View style={[st.heroFill, { width: `${Math.min(healthScore, 100)}%` }]} /></View>
          </View>
          <View style={st.heroRingWrap}>
            <Svg width={100} height={100}>
              <Circle cx={50} cy={50} r={40} stroke="rgba(255,255,255,0.2)" strokeWidth={8} fill="none" />
              <Circle cx={50} cy={50} r={40} stroke="#FFF" strokeWidth={8} fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - healthScore / 100)}
                rotation="-90" origin="50, 50" />
            </Svg>
            <View style={st.heroRingCenter}>
              <Ionicons name="heart" size={24} color="rgba(255,255,255,0.9)" />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats Grid */}
      <View style={st.statsSection}>
        <Text style={[st.sectionTitle, { color: colors.text }]}>Today's Overview</Text>
        <View style={st.statsGrid}>
          <QuickStatCard icon="footsteps-outline" label="Steps" value={(fitness.steps || 0).toLocaleString()} unit="" color="#3B82F6" bg={colors.fitnessStepsBg} colors={colors} />
          <QuickStatCard icon="water-outline" label="Water" value={fitness.water || 0} unit="ml" color="#06B6D4" bg={colors.fitnessWaterBg} colors={colors} />
          <QuickStatCard icon="moon-outline" label="Sleep" value={fitness.sleep || 0} unit="hrs" color="#6366F1" bg={colors.fitnessSleepBg} colors={colors} />
          <QuickStatCard icon="flame-outline" label="Calories" value={fitness.calories || 0} unit="kcal" color="#FB923C" bg={colors.fitnessCalBg} colors={colors} />
        </View>
      </View>

      {/* Date Selector */}
      <View style={st.dateSection}>
        <Text style={[st.sectionTitle, { color: colors.text }]}>{MONTH_NAMES[today.getMonth()]} {today.getFullYear()}</Text>
      </View>
      <FlatList data={days} renderItem={renderDayItem} horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={st.dayList} keyExtractor={(item) => item.key} />

      {/* Medication Progress */}
      <View style={st.medSection}>
        <View style={st.sectionHeader}>
          <Text style={[st.sectionTitle, { color: colors.text }]}>Medication Progress</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
            <Text style={[st.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[st.medCard, { backgroundColor: colors.card }, Platform.select({
          ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12 },
          android: { elevation: 3 },
        })]}>
          <View style={st.medRow}>
            <View style={st.medRingWrap}>
              <Svg width={80} height={80}>
                <Circle cx={40} cy={40} r={32} stroke={colors.border} strokeWidth={7} fill="none" />
                <Circle cx={40} cy={40} r={32} stroke={colors.primary} strokeWidth={7} fill="none"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - (medsTotal > 0 ? medsTaken / medsTotal : 0))}
                  rotation="-90" origin="40, 40" />
              </Svg>
              <View style={st.medRingCenter}>
                <Text style={[st.medRingNum, { color: colors.text }]}>{medsTaken}</Text>
                <Text style={[st.medRingSub, { color: colors.textTertiary }]}>/{medsTotal}</Text>
              </View>
            </View>
            <View style={st.medStats}>
              {[
                { label: 'Taken', val: dashboardData?.medications?.taken || 0, color: '#22C55E' },
                { label: 'Pending', val: dashboardData?.medications?.pending || 0, color: '#F59E0B' },
                { label: 'Missed', val: dashboardData?.medications?.missed || 0, color: '#EF4444' },
              ].map((s) => (
                <View key={s.label} style={st.medStatRow}>
                  <View style={[st.medStatDot, { backgroundColor: s.color }]} />
                  <Text style={[st.medStatLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                  <Text style={[st.medStatVal, { color: colors.text }]}>{s.val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Today's Schedule */}
      {dashboardData?.reminders?.length > 0 && (
        <View style={st.schedSection}>
          <View style={st.sectionHeader}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
              <Text style={[st.seeAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.reminders.slice(0, 4).map((item, i) => (
            <TouchableOpacity key={item._id || i}
              style={[st.schedItem, { backgroundColor: colors.card, borderColor: colors.borderLight },
                Platform.select({
                  ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
                  android: { elevation: 1 },
                })]}
              activeOpacity={0.8}>
              <View style={[st.schedIcon, { backgroundColor: item.type === 'medication' ? colors.primaryLight : colors.accentLight }]}>
                <Ionicons name={item.type === 'medication' ? 'medical-outline' : 'calendar-outline'} size={20}
                  color={item.type === 'medication' ? colors.primary : colors.accent} />
              </View>
              <View style={st.schedInfo}>
                <Text style={[st.schedName, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[st.schedSub, { color: colors.textTertiary }]}>{item.subtitle || item.time || 'Scheduled'}</Text>
              </View>
              <View style={[st.timeBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[st.timeText, { color: colors.primary }]}>{item.time || '--:--'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Dashboard overview cards */}
      <DashboardOverview
        healthScore={dashboardData?.healthScore}
        medications={dashboardData?.medications}
        fitness={dashboardData?.fitness}
        reminders={dashboardData?.reminders}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const st = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 32 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandPill: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  /* Greeting */
  greetingSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  greetingLabel: { fontSize: 14, fontWeight: '500' },
  greetingName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3, marginTop: 2 },

  /* Hero card */
  heroCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 20, overflow: 'hidden' },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft: { flex: 1, marginRight: 12 },
  heroLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroScore: { fontSize: 44, fontWeight: '900', color: '#FFF' },
  heroMax: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  heroGradeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  heroDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  heroGradeText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  heroTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 12 },
  heroFill: { height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  heroRingWrap: { alignItems: 'center', justifyContent: 'center' },
  heroRingCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },

  /* Stats grid */
  statsSection: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: IS_SMALL ? 8 : 12 },
  statCard: { width: CARD_W, borderRadius: 16, padding: IS_SMALL ? 10 : 14 },
  statIconWrap: { width: IS_SMALL ? 34 : 40, height: IS_SMALL ? 34 : 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: IS_SMALL ? 8 : 10 },
  statValue: { fontSize: IS_SMALL ? 17 : 20, fontWeight: '800' },
  statUnit: { fontSize: 12, fontWeight: '600' },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },

  /* Date */
  dateSection: { paddingHorizontal: 20, marginTop: 8 },
  dayList: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  dayItem: { width: 52, height: 72, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  dayName: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayDate: { fontSize: 18, fontWeight: '800' },
  dayDateActive: { color: '#FFF' },
  todayDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFF', marginTop: 4 },

  /* Med progress */
  medSection: { paddingHorizontal: 20, marginBottom: 8, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  medCard: { borderRadius: 20, padding: 20 },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  medRingWrap: { alignItems: 'center', justifyContent: 'center' },
  medRingCenter: { position: 'absolute', alignItems: 'center' },
  medRingNum: { fontSize: 22, fontWeight: '800' },
  medRingSub: { fontSize: 13, fontWeight: '600' },
  medStats: { flex: 1, gap: 10 },
  medStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  medStatDot: { width: 8, height: 8, borderRadius: 4 },
  medStatLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  medStatVal: { fontSize: 15, fontWeight: '700' },

  /* Schedule */
  schedSection: { paddingHorizontal: 20, marginTop: 8 },
  schedItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1 },
  schedIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  schedInfo: { flex: 1 },
  schedName: { fontSize: 15, fontWeight: '700' },
  schedSub: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  timeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  timeText: { fontSize: 12, fontWeight: '700' },
});

export default HomeScreen;
