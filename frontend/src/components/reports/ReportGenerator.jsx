import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import Dropdown from '../common/Dropdown';
const ReportGenerator = ({ onGenerate }) => {
  const { colors } = useAppTheme();
  const [type, setType] = useState('weekly');
  const [loading, setLoading] = useState(false);

  const reportTypeOptions = [
    { label: 'Weekly Report', value: 'weekly' },
    { label: 'Monthly Report', value: 'monthly' },
  ];

  const generate = async () => { setLoading(true); await onGenerate?.(type); setLoading(false); };
  return (
    <View style={s.c}>
      <Text style={[s.t, { color: colors.text }]}>Generate Report</Text>
      <Dropdown
        label="Report Type"
        options={reportTypeOptions}
        value={type}
        onChange={setType}
        placeholder="Select report type"
        required
      />
      <TouchableOpacity style={[s.g, { backgroundColor: colors.primary }]} onPress={generate} disabled={loading}>
        {loading?<ActivityIndicator color="#FFF"/>:<Text style={s.gt}>Generate</Text>}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:18,fontWeight:'600',marginBottom:12},g:{padding:14,borderRadius:8,alignItems:'center',marginTop:16},gt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default ReportGenerator;
