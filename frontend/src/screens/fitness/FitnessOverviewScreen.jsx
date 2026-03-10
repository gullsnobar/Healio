import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import StepCounter from '../../components/fitness/StepCounter';
import SleepTracker from '../../components/fitness/SleepTracker';
import WaterIntakeLogger from '../../components/fitness/WaterIntakeLogger';
import GoogleFitSync from '../../components/fitness/GoogleFitSync';
import { fetchFitnessData } from '../../redux/slices/fitnessSlice';

const FitnessCard = ({ children, gradient, style }) =>
  gradient ? (
    <LinearGradient colors={gradient} style={[fs.card, style]}>{children}</LinearGradient>
  ) : (
    <View style={[fs.card, style]}>{children}</View>
  );

const ActionBtn = ({ icon, label, color, bg, onPress }) => (
  <TouchableOpacity style={[fs.actionBtn, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[fs.actionLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const FitnessOverviewScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { dailyData, loading } = useSelector((state) => state.fitness);
  useEffect(() => { dispatch(fetchFitnessData()); }, []);

  const nav = (screen) => () => navigation.navigate(screen);
  const data = dailyData || {};

  return (
    <ScrollView style={[fs.c, { backgroundColor: colors.background }]} contentContainerStyle={fs.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <LinearGradient colors={isDark ? ['#064E3B', '#065F46'] : ['#059669', '#10B981']} style={fs.header}>
        <Text style={fs.headerTitle}>Fitness</Text>
        <Text style={fs.headerSub}>Stay active, stay healthy</Text>
      </LinearGradient>

      <View style={fs.body}>
        <GoogleFitSync lastSynced={data.lastSynced} onSync={() => dispatch(fetchFitnessData())} />

        <TouchableOpacity onPress={nav('Steps')} activeOpacity={0.9}>
          <FitnessCard gradient={colors.stepsGrad}>
            <StepCounter steps={data.steps || 0} dark />
          </FitnessCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={nav('Sleep')} activeOpacity={0.9}>
          <FitnessCard gradient={colors.sleepGrad}>
            <SleepTracker hours={data.sleep || 0} dark />
          </FitnessCard>
        </TouchableOpacity>

        <FitnessCard style={{ backgroundColor: colors.card }}>
          <WaterIntakeLogger intake={data.water || 0} onAdd={() => {}} />
        </FitnessCard>

        <Text style={[fs.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={fs.actionRow}>
          <ActionBtn icon="restaurant-outline" label="Diet Log"     color={colors.warningDark} bg={colors.warningLight} onPress={nav('DietLog')} />
          <ActionBtn icon="create-outline"    label="Manual Entry" color={colors.fitnessSleep} bg={colors.fitnessSleepBg} onPress={nav('ManualEntry')} />
        </View>
        <View style={[fs.actionRow, { marginTop: 10 }]}>
          <ActionBtn icon="barbell-outline"    label="Exercise"     color={isDark ? '#C4B5FD' : '#7C3AED'} bg={isDark ? '#3B1F7E' : '#EDE9FE'} onPress={nav('ExerciseLog')} />
          <ActionBtn icon="time-outline"       label="Meal History" color={isDark ? '#FB923C' : '#EA580C'} bg={isDark ? '#7C2D12' : '#FFF7ED'} onPress={nav('MealHistory')} />
        </View>
        <View style={[fs.actionRow, { marginTop: 10 }]}>
          <ActionBtn icon="bar-chart-outline"  label="Weekly Charts" color={isDark ? '#7DD3FC' : '#0369A1'} bg={isDark ? '#1E3A5F' : '#E0F2FE'}  onPress={nav('WeeklyCharts')} />
          <ActionBtn icon="bulb-outline"       label="AI Insights"   color={isDark ? '#6EE7B7' : '#059669'} bg={isDark ? '#064E3B' : '#ECFDF5'}  onPress={nav('HealthInsights')} />
        </View>
      </View>
    </ScrollView>
  );
};

const fs = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  card: { borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  actionLabel: { fontSize: 14, fontWeight: '700' },
});
export default FitnessOverviewScreen;
