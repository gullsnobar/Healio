import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import LabReportList from '../../components/labReports/LabReportList';
import { fetchLabReports } from '../../redux/slices/labReportSlice';

const LabReportListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.labReport);
  const { colors } = useAppTheme();
  useEffect(() => { dispatch(fetchLabReports()); }, []);
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <LabReportList reports={reports} loading={loading} onItemPress={(r) => navigation.navigate('ViewLabReport', { id: r._id })} />
      <TouchableOpacity style={[s.fab, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('UploadLabReport')}>
        <Ionicons name="cloud-upload" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,alignItems:'center',justifyContent:'center',elevation:4}});
export default LabReportListScreen;
