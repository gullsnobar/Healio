import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import { fetchDashboardData } from '../../redux/slices/userSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.user);

  useEffect(() => { dispatch(fetchDashboardData()); }, []);

  return (
    <ScrollView style={s.c} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchDashboardData())} />}>
      <DashboardOverview
        healthScore={dashboardData?.healthScore}
        medications={dashboardData?.medications}
        fitness={dashboardData?.fitness}
        reminders={dashboardData?.reminders}
      />
    </ScrollView>
  );
};

const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default HomeScreen;
