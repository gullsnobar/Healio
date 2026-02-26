import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import UploadLabReport from '../../components/labReports/UploadLabReport';
import { uploadLabReport } from '../../redux/slices/labReportSlice';

const UploadLabReportScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleUpload = async (data) => {
    const result = await dispatch(uploadLabReport(data));
    if (!result.error) { Alert.alert('Success', 'Report uploaded'); navigation.goBack(); }
  };
  return <ScrollView style={s.c}><UploadLabReport onUpload={handleUpload} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default UploadLabReportScreen;
