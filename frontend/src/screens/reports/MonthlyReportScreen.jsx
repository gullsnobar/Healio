import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MonthlyReport from '../../components/reports/MonthlyReport';
import ReportDownload from '../../components/reports/ReportDownload';
import { fetchMonthlyReport } from '../../redux/slices/reportSlice';

const MonthlyReportScreen = () => {
  const dispatch = useDispatch();
  const { monthlyReport } = useSelector((state) => state.report);
  useEffect(() => { dispatch(fetchMonthlyReport()); }, []);
  return (
    <View style={s.c}>
      <MonthlyReport report={monthlyReport} />
      <View style={s.dl}><ReportDownload onDownload={() => {}} /></View>
    </View>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' }, dl: { padding: 16 } });
export default MonthlyReportScreen;
