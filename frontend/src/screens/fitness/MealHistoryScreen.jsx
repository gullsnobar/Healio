import React, { useEffect, useCallback, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  RefreshControl, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import { fetchMealHistory, deleteMeal } from '../../redux/slices/fitnessSlice';

const MEAL_ICONS = {
  breakfast: 'cafe',
  lunch: 'restaurant',
  dinner: 'pizza',
  snack: 'ice-cream',
};

const MealCard = ({ meal, colors, onDelete }) => (
  <View style={[s.mealCard, { backgroundColor: colors.card },
    Platform.select({
      ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    })]}>
    <View style={s.mealHeader}>
      <View style={[s.mealIcon, { backgroundColor: colors.fitnessDietBg }]}>
        <Ionicons name={MEAL_ICONS[meal.type] || 'restaurant'} size={18} color={colors.fitnessDiet} />
      </View>
      <View style={s.mealMeta}>
        <Text style={[s.mealType, { color: colors.text }]}>{meal.type?.charAt(0).toUpperCase() + meal.type?.slice(1)}</Text>
        {meal.time && (
          <Text style={[s.mealTime, { color: colors.textTertiary }]}>
            {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
      <Text style={[s.mealCal, { color: colors.fitnessCal }]}>{meal.totalCalories || 0} kcal</Text>
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(meal._id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
    {meal.items?.length > 0 && (
      <View style={s.itemList}>
        {meal.items.map((item, i) => (
          <View key={i} style={[s.itemRow, { borderTopColor: colors.border }]}>
            <Text style={[s.itemName, { color: colors.textSecondary }]}>{item.name}</Text>
            <Text style={[s.itemCal, { color: colors.textTertiary }]}>{item.calories || 0} kcal</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

const DaySection = ({ date, meals, calories, colors, onDeleteMeal }) => (
  <View style={s.daySection}>
    <View style={s.dayHeader}>
      <Text style={[s.dayDate, { color: colors.text }]}>
        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </Text>
      <Text style={[s.dayTotal, { color: colors.fitnessCal }]}>{calories} kcal</Text>
    </View>
    {meals.map((meal, i) => (
      <MealCard key={meal._id || i} meal={meal} colors={colors} onDelete={onDeleteMeal} />
    ))}
  </View>
);

const MealHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const { mealHistory, loading } = useSelector((state) => state.fitness);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => { dispatch(fetchMealHistory()); }, [dispatch]);
  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMealHistory());
    setRefreshing(false);
  };

  const handleDeleteMeal = (mealId) => {
    Alert.alert('Delete Meal', 'Are you sure you want to delete this meal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteMeal(mealId)).then(loadData) },
    ]);
  };

  const logs = mealHistory?.data?.logs || [];
  const stats = mealHistory?.data?.stats || {};

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <LinearGradient
        colors={isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark]}
        style={s.header}
      >
        <Text style={s.headerTitle}>Meal History</Text>
        <Text style={s.headerSub}>
          {stats.totalDays || 0} days logged | Avg {stats.avgCalories || 0} kcal/day
        </Text>
      </LinearGradient>

      <View style={s.body}>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('DietLog')}
        >
          <Ionicons name="add-circle" size={20} color="#FFF" />
          <Text style={s.addBtnText}>Log Today's Meal</Text>
        </TouchableOpacity>

        {logs.length === 0 && !loading && (
          <View style={[s.empty, { backgroundColor: colors.card }]}>
            <Ionicons name="restaurant-outline" size={48} color={colors.textTertiary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>
              No meals logged yet. Start tracking your nutrition!
            </Text>
          </View>
        )}

        {logs.map((log) => (
          <DaySection
            key={log._id}
            date={log.date}
            meals={log.meals}
            calories={log.totalCalories}
            colors={colors}
            onDeleteMeal={handleDeleteMeal}
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
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8, marginBottom: 20 },
  addBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  daySection: { marginBottom: 20 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dayDate: { fontSize: 14, fontWeight: '700' },
  dayTotal: { fontSize: 13, fontWeight: '700' },
  mealCard: { borderRadius: 14, padding: 14, marginBottom: 8 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mealIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mealMeta: { flex: 1 },
  mealType: { fontSize: 14, fontWeight: '600' },
  mealTime: { fontSize: 11, marginTop: 1 },
  mealCal: { fontSize: 14, fontWeight: '700', marginRight: 8 },
  itemList: { marginTop: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth },
  itemName: { fontSize: 12 },
  itemCal: { fontSize: 12 },
  empty: { alignItems: 'center', padding: 32, borderRadius: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 12 },
});

export default MealHistoryScreen;
