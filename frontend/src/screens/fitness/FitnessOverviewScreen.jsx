import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const { dailyData, loading } = useSelector((state) => state.fitness);
  useEffect(() => { dispatch(fetchFitnessData()); }, []);

  const nav = (screen) => () => navigation.navigate(screen);
  const data = dailyData || {};

  return (
    <ScrollView style={fs.c} contentContainerStyle={fs.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <LinearGradient colors={['#059669', '#10B981']} style={fs.header}>
        <Text style={fs.headerTitle}>Fitness</Text>
        <Text style={fs.headerSub}>Stay active, stay healthy</Text>
      </LinearGradient>

      <View style={fs.body}>
        <GoogleFitSync lastSynced={data.lastSynced} onSync={() => dispatch(fetchFitnessData())} />

        <TouchableOpacity onPress={nav('Steps')} activeOpacity={0.9}>
          <FitnessCard gradient={['#1D4ED8', '#3B82F6']}>
            <StepCounter steps={data.steps || 0} dark />
          </FitnessCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={nav('Sleep')} activeOpacity={0.9}>
          <FitnessCard gradient={['#5B21B6', '#7C3AED']}>
            <SleepTracker hours={data.sleep || 0} dark />
          </FitnessCard>
        </TouchableOpacity>

        <FitnessCard style={fs.waterCard}>
          <WaterIntakeLogger intake={data.water || 0} onAdd={() => {}} />
        </FitnessCard>

        <Text style={fs.sectionTitle}>Quick Actions</Text>
        <View style={fs.actionRow}>
          <ActionBtn icon="restaurant-outline" label="Diet Log"     color="#D97706" bg="#FEF3C7" onPress={nav('DietLog')} />
          <ActionBtn icon="create-outline"    label="Manual Entry" color="#7C3AED" bg="#EDE9FE" onPress={nav('ManualEntry')} />
        </View>
      </View>
    </ScrollView>
  );
};

const fs = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  card: { borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  waterCard: { backgroundColor: '#fff' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 10, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  actionLabel: { fontSize: 14, fontWeight: '700' },
});
export default FitnessOverviewScreen;
