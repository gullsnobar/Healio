import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const ReportDownload = ({ onDownload, loading = false }) => {
  const { colors } = useAppTheme();
  return (
  <TouchableOpacity style={[s.b, { backgroundColor: colors.primary }]} onPress={onDownload} disabled={loading}>
    {loading ? <ActivityIndicator color="#FFF" /> : <><Ionicons name="download-outline" size={20} color="#FFF" /><Text style={s.t}>Download Report</Text></>}
  </TouchableOpacity>
  );
};
const s = StyleSheet.create({b:{flexDirection:'row',padding:14,borderRadius:8,alignItems:'center',justifyContent:'center',gap:8},t:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default ReportDownload;
