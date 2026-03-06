import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../styles/theme';
const ReportGenerator = ({ onGenerate }) => {
  const { colors } = useAppTheme();
  const [type, setType] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const generate = async () => { setLoading(true); await onGenerate?.(type); setLoading(false); };
  return (
    <View style={s.c}>
      <Text style={[s.t, { color: colors.text }]}>Generate Report</Text>
      <View style={s.r}>{['weekly','monthly'].map(t=>(
        <TouchableOpacity key={t} style={[s.b, { borderColor: colors.primary }, type===t && { backgroundColor: colors.primary }]} onPress={()=>setType(t)}>
          <Text style={[s.bt, { color: colors.primary }, type===t && { color: '#FFF' }]}>{t}</Text>
        </TouchableOpacity>
      ))}</View>
      <TouchableOpacity style={[s.g, { backgroundColor: colors.primary }]} onPress={generate} disabled={loading}>
        {loading?<ActivityIndicator color="#FFF"/>:<Text style={s.gt}>Generate</Text>}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:18,fontWeight:'600',marginBottom:12},r:{flexDirection:'row',gap:12,marginBottom:16},b:{flex:1,padding:12,borderRadius:8,borderWidth:1,alignItems:'center'},bt:{fontWeight:'600',textTransform:'capitalize'},g:{padding:14,borderRadius:8,alignItems:'center'},gt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default ReportGenerator;
