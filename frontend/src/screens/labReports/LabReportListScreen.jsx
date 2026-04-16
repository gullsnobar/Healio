import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import LabReportList from '../../components/labReports/LabReportList';
import FAB from '../../components/common/FloatingActionButton';
import { fetchLabReports } from '../../redux/slices/labReportSlice';

const LabReportListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.labReport);
  const { colors } = useAppTheme();
  useEffect(() => { dispatch(fetchLabReports()); }, []);
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <LabReportList
        reports={reports}
        loading={loading}
        onItemPress={(r) => navigation.navigate('ViewLabReport', { id: r._id })}
      />
      <FAB
        icon="cloud-upload"
        onPress={() => navigation.navigate('UploadLabReport')}
        size="medium"
        position="bottom-right"
        offsetY={100}
      />
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1}});
export default LabReportListScreen;
