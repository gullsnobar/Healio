import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import LabReportViewer from '../../components/labReports/LabReportViewer';

const ViewLabReportScreen = ({ route }) => {
  const { id } = route.params;
  const report = useSelector((state) => state.labReport.reports.find(r => r._id === id));
  return <View style={s.c}><LabReportViewer report={report} /></View>;
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default ViewLabReportScreen;
