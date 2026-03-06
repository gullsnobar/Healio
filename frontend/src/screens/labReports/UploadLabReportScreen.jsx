import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import UploadLabReport from '../../components/labReports/UploadLabReport';
import { uploadLabReport } from '../../redux/slices/labReportSlice';

const UploadLabReportScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleUpload = async (data) => {
    const result = await dispatch(uploadLabReport(data));
    if (!result.error) { Alert.alert('Success', 'Report uploaded'); navigation.goBack(); }
  };
  const { colors } = useAppTheme();
  return <ScrollView style={[s.c, { backgroundColor: colors.background }]}><UploadLabReport onUpload={handleUpload} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default UploadLabReportScreen;
