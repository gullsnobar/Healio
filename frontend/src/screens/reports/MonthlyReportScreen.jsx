import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import MonthlyReport from '../../components/reports/MonthlyReport';
import ReportDownload from '../../components/reports/ReportDownload';
import { fetchMonthlyReport } from '../../redux/slices/reportSlice';

const MonthlyReportScreen = () => {
  const dispatch = useDispatch();
  const { monthlyReport } = useSelector((state) => state.report);
  useEffect(() => { dispatch(fetchMonthlyReport()); }, []);
  const { colors } = useAppTheme();
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <MonthlyReport report={monthlyReport} />
      <View style={s.dl}><ReportDownload onDownload={() => {}} /></View>
    </View>
  );
};
const s = StyleSheet.create({ c: { flex: 1 }, dl: { padding: 16 } });
export default MonthlyReportScreen;
