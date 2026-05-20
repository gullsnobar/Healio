import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  ScrollView, StyleSheet, RefreshControl, View, Text, StatusBar,
  TouchableOpacity, FlatList, Dimensions, Animated, Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '../../styles/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeToggle from '../../components/common/ThemeToggle';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import { fetchDashboardData, fetchHealthScore } from '../../redux/slices/userSlice';
import { fetchMedications } from '../../redux/slices/medicationSlice';
import { fetchFitnessData } from '../../redux/slices/fitnessSlice';
import { fetchUpcomingReminders } from '../../redux/slices/reminderSlice';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;
const IS_MOBILE = SCREEN_W < 768;
const IS_TABLET = SCREEN_W >= 768 && SCREEN_W < 1024;
const IS_DESKTOP = SCREEN_W >= 1024;

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
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { dashboardData, loading, healthScore: healthScoreData } = useSelector((state) => state.user);
  const { medications: medicationList } = useSelector((state) => state.medication);
  const { dailyData: fitnessDaily } = useSelector((state) => state.fitness);
  const { upcoming: upcomingReminders } = useSelector((state) => state.reminder);
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.split(' ')[0] || 'there';
  const [selectedDay, setSelectedDay] = useState(3);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth) {
      return window.innerWidth >= 1024;
    }
    return SCREEN_W >= 1024;
  });

  const days = useMemo(() => getDays(), []);
  const today = new Date();
  const greeting = useMemo(() => getGreeting(), []);

  const selectedDayObj = days[selectedDay];
  const selectedIsToday = selectedDayObj?.isToday;
  const selectedDateParam = selectedIsToday ? undefined : selectedDayObj?.key.slice(0, 10);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchHealthScore());
      dispatch(fetchMedications());
      dispatch(fetchFitnessData());
      dispatch(fetchUpcomingReminders());
      if (selectedDateParam) dispatch(fetchDashboardData(selectedDateParam));
      else dispatch(fetchDashboardData());
    }, [dispatch, selectedDateParam]),
  );

  useEffect(() => {
    if (selectedDateParam) dispatch(fetchDashboardData(selectedDateParam));
    else dispatch(fetchDashboardData());
  }, [dispatch, selectedDateParam]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024);
      } else {
        const { width } = Dimensions.get('window');
        setIsDesktop(width >= 1024);
      }
    };

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize);
    }

    const dims = Dimensions.addEventListener?.('change', handleResize);

    return () => {
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('resize', handleResize);
      }
      if (dims?.remove) {
        dims.remove();
      }
    };
  }, []);

  const IS_DESKTOP = isDesktop;

  const medsStatus = useMemo(() => {
    const medsData = dashboardData?.medications || {};
    return {
      taken: medsData.taken || 0,
      missed: medsData.missed || 0,
      pending: medsData.pending || 0,
      total: (medsData.taken || 0) + (medsData.missed || 0) + (medsData.pending || 0),
    };
  }, [dashboardData]);

  const medsTaken = medsStatus.taken;
  const medsTotal = medsStatus.total;

  const healthScore =
    typeof healthScoreData?.score === 'number'
      ? healthScoreData.score
      : dashboardData?.healthScore || 0;

  const fitnessFromDashboard = dashboardData?.fitness || {};
  const fitnessFromDaily = fitnessDaily || {};

  const fitness = {
    steps:
      fitnessFromDaily.steps ??
      fitnessFromDashboard.steps ??
      0,
    water:
      fitnessFromDaily.water ??
      fitnessFromDashboard.water ??
      0,
    sleep:
      fitnessFromDaily.sleep ??
      fitnessFromDashboard.sleep ??
      0,
    calories:
      fitnessFromDaily.calories ??
      fitnessFromDashboard.caloriesBurned ??
      fitnessFromDashboard.calories ??
      0,
  };

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
    <ScrollView
      style={[st.c, { backgroundColor: colors.background, paddingTop: insets.top + 4 }]}
      contentContainerStyle={st.content}
      showsVerticalScrollIndicator={false}
      refreshControl={(
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            if (selectedDateParam) dispatch(fetchDashboardData(selectedDateParam));
            else dispatch(fetchDashboardData());
            dispatch(fetchHealthScore());
            dispatch(fetchMedications());
            dispatch(fetchFitnessData());
            dispatch(fetchUpcomingReminders());
          }}
          tintColor={colors.primary}
        />
      )}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={st.header}>
        <View style={st.headerLeft}>
          <TouchableOpacity
            style={[st.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={[st.brandPill, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="heart-pulse" size={18} color={colors.primary} />
          </View>
          <Text style={[st.brand, { color: colors.text }]}>MR & FT</Text>
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
          <QuickStatCard icon="walk" label="Steps" value={(fitness.steps || 0).toLocaleString()} unit="" color="#3B82F6" bg={colors.fitnessStepsBg} colors={colors} />
          <QuickStatCard icon="water-outline" label="Water" value={fitness.water || 0} unit="ml" color="#06B6D4" bg={colors.fitnessWaterBg} colors={colors} />
          <QuickStatCard icon="moon-outline" label="Sleep" value={fitness.sleep || 0} unit="hrs" color="#6366F1" bg={colors.fitnessSleepBg} colors={colors} />
          <QuickStatCard icon="flame-outline" label="Calories" value={fitness.calories || 0} unit="kcal" color="#FB923C" bg={colors.fitnessCalBg} colors={colors} />
        </View>
      </View>

      {/* Date Selector */}
      <View style={st.dateSection}>
        <Text style={[st.sectionTitle, { color: colors.text }]}>{MONTH_NAMES[today.getMonth()]} {today.getFullYear()}</Text>
      </View>
      <FlatList
        data={days}
        renderItem={renderDayItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={st.dayList}
        keyExtractor={(item) => item.key}
      />

      {/* Medication Progress */}
      <View style={st.medSection}>
        <View style={st.sectionHeader}>
          <Text style={[st.sectionTitle, { color: colors.text }]}>Medication Progress</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicationList')} style={st.seeAllContainer}>
            <Text style={[st.seeAll, { color: colors.primary }]}>See All</Text>
            <Text style={[st.seeAllDesc, { color: colors.textTertiary }]}>View & manage meds</Text>
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
                { label: 'Taken', val: medsStatus.taken, color: '#22C55E' },
                { label: 'Pending', val: medsStatus.pending, color: '#F59E0B' },
                { label: 'Missed', val: medsStatus.missed, color: '#EF4444' },
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
      {upcomingReminders?.length > 0 && (
        <View style={st.schedSection}>
          <View style={st.sectionHeader}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reminders')} style={st.seeAllContainer}>
              <Text style={[st.seeAll, { color: colors.primary }]}>View All</Text>
              <Text style={[st.seeAllDesc, { color: colors.textTertiary }]}>Manage reminders</Text>
            </TouchableOpacity>
          </View>
          {upcomingReminders.slice(0, 4).map((item, i) => {
            const typeKey = item.reminderType || item.type || 'appointment';
            const isMed = typeKey === 'medication';
            return (
              <TouchableOpacity
                key={item._id || i}
                style={[st.schedItem, {
                  backgroundColor: colors.card,
                  borderColor: colors.borderLight,
                  ...Platform.select({
                    ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
                    android: { elevation: 1 },
                  }),
                }]}
                activeOpacity={0.8}
              >
                <View style={[st.schedIcon, { backgroundColor: isMed ? colors.primaryLight : colors.accentLight }]}>
                  <Ionicons
                    name={isMed ? 'medical-outline' : 'calendar-outline'}
                    size={20}
                    color={isMed ? colors.primary : colors.accent}
                  />
                </View>
                <View style={st.schedInfo}>
                  <Text style={[st.schedName, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[st.schedSub, { color: colors.textTertiary }]}>{item.subtitle || item.time || 'Scheduled'}</Text>
                </View>
                <View style={[st.timeBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[st.timeText, { color: colors.primary }]}>{item.time || '--:--'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Dashboard overview cards */}
      <DashboardOverview
        medications={{
          taken: medsStatus.taken,
          missed: medsStatus.missed,
          pending: medsStatus.pending,
        }}
        fitness={{
          steps: fitness.steps,
          sleep: fitness.sleep,
          water: fitness.water,
        }}
        reminders={upcomingReminders}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const st = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 0 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: IS_SMALL ? 16 : 20, paddingTop: 12, paddingBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: IS_SMALL ? 8 : 10 },
  brandPill: { width: IS_SMALL ? 32 : 36, height: IS_SMALL ? 32 : 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: IS_SMALL ? 16 : 18, fontWeight: '800', letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: IS_SMALL ? 8 : 12 },
  iconBtn: { width: IS_SMALL ? 36 : 40, height: IS_SMALL ? 36 : 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarSmall: { width: IS_SMALL ? 32 : 36, height: IS_SMALL ? 32 : 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: IS_SMALL ? 12 : 14, fontWeight: '700' },

  /* Greeting */
  greetingSection: { paddingHorizontal: IS_SMALL ? 16 : 20, paddingTop: 16, paddingBottom: 12 },
  greetingLabel: { fontSize: IS_SMALL ? 12 : 14, fontWeight: '500' },
  greetingName: { fontSize: IS_SMALL ? 24 : 26, fontWeight: '800', letterSpacing: -0.3, marginTop: 2 },

  /* Hero card */
  heroCard: { marginHorizontal: IS_SMALL ? 16 : 20, borderRadius: 20, padding: IS_SMALL ? 16 : 20, marginBottom: 20, overflow: 'hidden' },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft: { flex: 1, minWidth: 180, marginRight: 12 },
  heroLabel: { fontSize: IS_SMALL ? 12 : 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroScore: { fontSize: IS_SMALL ? 36 : 44, fontWeight: '900', color: '#FFF' },
  heroMax: { fontSize: IS_SMALL ? 14 : 18, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  heroGradeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  heroDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  heroGradeText: { fontSize: IS_SMALL ? 12 : 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  heroTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 12 },
  heroFill: { height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  heroRingWrap: { alignItems: 'center', justifyContent: 'center' },
  heroRingCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },

  /* Stats grid */
  statsSection: { paddingHorizontal: IS_SMALL ? 16 : 20, marginBottom: 8 },
  sectionTitle: { fontSize: IS_SMALL ? 15 : 17, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: IS_SMALL ? 8 : 12 },
  statCard: { flexBasis: IS_TABLET ? '23%' : '48%', maxWidth: IS_TABLET ? '23%' : '48%', borderRadius: 16, padding: IS_SMALL ? 12 : 14, marginBottom: IS_SMALL ? 8 : 0 },
  statIconWrap: { width: IS_SMALL ? 34 : 40, height: IS_SMALL ? 34 : 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: IS_SMALL ? 8 : 10 },
  statValue: { fontSize: IS_SMALL ? 17 : 20, fontWeight: '800' },
  statUnit: { fontSize: 12, fontWeight: '600' },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },

  /* Date */
  dateSection: { paddingHorizontal: IS_SMALL ? 16 : 20, marginTop: 8 },
  dayList: { paddingHorizontal: 16, paddingBottom: 16 },
  dayListWrap: { justifyContent: 'space-between', marginBottom: 12 },
  dayItem: { flex: 1, minWidth: 52, minHeight: 52, maxWidth: 84, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  dayName: { fontSize: IS_SMALL ? 12 : 13, fontWeight: '600', marginBottom: 4 },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayDate: { fontSize: IS_SMALL ? 16 : 18, fontWeight: '800' },
  dayDateActive: { color: '#FFF' },
  todayDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFF', marginTop: 4 },

  /* Med progress */
  medSection: { paddingHorizontal: IS_SMALL ? 16 : 20, marginBottom: 8, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
  seeAllContainer: { alignItems: 'flex-end' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  seeAllDesc: { fontSize: 11, marginTop: 2 },
  medCard: { borderRadius: 20, padding: IS_SMALL ? 16 : 20 },
  medRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: IS_SMALL ? 12 : 20 },
  medRingWrap: { alignItems: 'center', justifyContent: 'center' },
  medRingCenter: { position: 'absolute', alignItems: 'center' },
  medRingNum: { fontSize: IS_SMALL ? 20 : 22, fontWeight: '800' },
  medRingSub: { fontSize: IS_SMALL ? 12 : 13, fontWeight: '600' },
  medStats: { flex: 1, gap: 10 },
  medStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  medStatDot: { width: 8, height: 8, borderRadius: 4 },
  medStatLabel: { flex: 1, fontSize: IS_SMALL ? 12 : 13, fontWeight: '500' },
  medStatVal: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '700' },

  /* Schedule */
  schedSection: { paddingHorizontal: IS_SMALL ? 16 : 20, marginTop: 8 },
  schedItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: IS_SMALL ? 12 : 14, marginBottom: 10, borderWidth: 1 },
  schedIcon: { width: IS_SMALL ? 40 : 44, height: IS_SMALL ? 40 : 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  schedInfo: { flex: 1 },
  schedName: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '700' },
  schedSub: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  timeBadge: { paddingHorizontal: IS_SMALL ? 10 : 12, paddingVertical: 6, borderRadius: 8 },
  timeText: { fontSize: 12, fontWeight: '700' },
});

export default HomeScreen;
