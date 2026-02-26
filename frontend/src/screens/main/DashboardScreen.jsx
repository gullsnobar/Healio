import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import WeeklyProgressChart from '../../components/dashboard/WeeklyProgressChart';
import MonthlyProgressChart from '../../components/dashboard/MonthlyProgressChart';
import HealthScoreWidget from '../../components/dashboard/HealthScoreWidget';

const DashboardScreen = () => {
  const { dashboardData } = useSelector((state) => state.user);

  return (
    <ScrollView style={s.c}>
      <View style={s.section}>
        <HealthScoreWidget score={dashboardData?.healthScore || 0} />
        <WeeklyProgressChart data={dashboardData?.weeklyProgress} />
        <MonthlyProgressChart data={dashboardData?.monthlyProgress} />
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' }, section: { padding: 16 } });
export default DashboardScreen;
