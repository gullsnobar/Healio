import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import WeeklyReport from '../../components/reports/WeeklyReport';
import ReportDownload from '../../components/reports/ReportDownload';
import { fetchWeeklyReport } from '../../redux/slices/reportSlice';

const WeeklyReportScreen = () => {
  const dispatch = useDispatch();
  const { weeklyReport } = useSelector((state) => state.report);
  useEffect(() => { dispatch(fetchWeeklyReport()); }, []);
  const { colors } = useAppTheme();
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <WeeklyReport report={weeklyReport} />
      <View style={s.dl}><ReportDownload onDownload={() => {}} /></View>
    </View>
  );
};
const s = StyleSheet.create({ c: { flex: 1 }, dl: { padding: 16 } });
export default WeeklyReportScreen;
