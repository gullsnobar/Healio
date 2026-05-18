import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { useAppTheme } from '../../styles/ThemeContext';
import StepCounter from '../../components/fitness/StepCounter';
import SleepTracker from '../../components/fitness/SleepTracker';
import WaterIntakeLogger from '../../components/fitness/WaterIntakeLogger';
import GoogleFitSync from '../../components/fitness/GoogleFitSync';
import { fetchFitnessData, syncGoogleFitThunk } from '../../redux/slices/fitnessSlice';

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
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message: String(message || '') });
  }, []);

  const nav = (screen) => () => navigation.navigate(screen);
  const data = dailyData || {};

  return (
    <View style={[fs.c, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={fs.content} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.card} />
        <LinearGradient colors={isDark ? ['#064E3B', '#065F46'] : ['#059669', '#10B981']} style={fs.header}>
          <Text style={fs.headerTitle}>Fitness</Text>
          <Text style={fs.headerSub}>Stay active, stay healthy</Text>
        </LinearGradient>

        <View style={fs.body}>
          <GoogleFitSync
            lastSynced={data.lastSynced}
            onSync={async () => {
              try {
                const res = await dispatch(syncGoogleFitThunk()).unwrap();
                await dispatch(fetchFitnessData());
                showToast(res?.message || 'Synced successfully');
              } catch (err) {
                Alert.alert('Google Fit Sync', typeof err === 'string' ? err : 'Failed to sync with Google Fit');
              }
            }}
          />

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

          <TouchableOpacity onPress={nav('WaterIntake')} activeOpacity={0.9}>
            <FitnessCard gradient={colors.waterGrad}>
              <WaterIntakeLogger intake={data.water || 0} onAdd={() => {}} dark />
            </FitnessCard>
          </TouchableOpacity>

          <Text style={[fs.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={fs.actionRow}>
            <ActionBtn icon="restaurant-outline" label="Diet Log"     color={colors.actionDietText} bg={colors.actionDietBg} onPress={nav('DietLog')} />
            <ActionBtn icon="create-outline"    label="Manual Entry" color={colors.actionManualText} bg={colors.actionManualBg} onPress={nav('ManualEntry')} />
          </View>
          <View style={[fs.actionRow, { marginTop: 10 }]}>
            <ActionBtn icon="barbell-outline"    label="Exercise"     color={colors.actionExerciseText} bg={colors.actionExerciseBg} onPress={nav('ExerciseLog')} />
            <ActionBtn icon="time-outline"       label="Meal History" color={colors.actionMealText} bg={colors.actionMealBg} onPress={nav('MealHistory')} />
          </View>
          <View style={[fs.actionRow, { marginTop: 10 }]}>
            <ActionBtn icon="bar-chart-outline"  label="Weekly Charts" color={colors.actionChartsText} bg={colors.actionChartsBg}  onPress={nav('WeeklyCharts')} />
            <ActionBtn icon="bulb-outline"       label="AI Insights"   color={colors.actionAIText} bg={colors.actionAIBg}  onPress={nav('HealthInsights')} />
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={toast.visible}
        onDismiss={() => setToast((p) => ({ ...p, visible: false }))}
        duration={2500}
        style={{ backgroundColor: colors.card }}
        action={{
          label: 'OK',
          onPress: () => setToast((p) => ({ ...p, visible: false })),
        }}
      >
        <Text style={{ color: colors.text }}>{toast.message}</Text>
      </Snackbar>
    </View>
  );
};

const fs = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTitle: { color: '#fffcfc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  card: { borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  actionLabel: { fontSize: 14, fontWeight: '700' },
});
export default FitnessOverviewScreen;
