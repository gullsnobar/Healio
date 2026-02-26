import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import LabReportList from '../../components/labReports/LabReportList';
import { fetchLabReports } from '../../redux/slices/labReportSlice';

const LabReportListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.labReport);
  useEffect(() => { dispatch(fetchLabReports()); }, []);
  return (
    <View style={s.c}>
      <LabReportList reports={reports} loading={loading} onItemPress={(r) => navigation.navigate('ViewLabReport', { id: r._id })} />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('UploadLabReport')}>
        <Ionicons name="cloud-upload" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA'},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,backgroundColor:'#4A90D9',alignItems:'center',justifyContent:'center',elevation:4}});
export default LabReportListScreen;
