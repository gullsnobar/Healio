import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import WeeklyReport from '../../components/reports/WeeklyReport';
import ReportDownload from '../../components/reports/ReportDownload';
import { fetchWeeklyReport } from '../../redux/slices/reportSlice';

const WeeklyReportScreen = () => {
  const dispatch = useDispatch();
  const { weeklyReport } = useSelector((state) => state.report);
  useEffect(() => { dispatch(fetchWeeklyReport()); }, []);
  return (
    <View style={s.c}>
      <WeeklyReport report={weeklyReport} />
      <View style={s.dl}><ReportDownload onDownload={() => {}} /></View>
    </View>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' }, dl: { padding: 16 } });
export default WeeklyReportScreen;
