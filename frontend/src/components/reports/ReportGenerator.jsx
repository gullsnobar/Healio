import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
const ReportGenerator = ({ onGenerate }) => {
  const [type, setType] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const generate = async () => { setLoading(true); await onGenerate?.(type); setLoading(false); };
  return (
    <View style={s.c}>
      <Text style={s.t}>Generate Report</Text>
      <View style={s.r}>{['weekly','monthly'].map(t=>(
        <TouchableOpacity key={t} style={[s.b,type===t&&s.ba]} onPress={()=>setType(t)}>
          <Text style={[s.bt,type===t&&s.bta]}>{t}</Text>
        </TouchableOpacity>
      ))}</View>
      <TouchableOpacity style={s.g} onPress={generate} disabled={loading}>
        {loading?<ActivityIndicator color="#FFF"/>:<Text style={s.gt}>Generate</Text>}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:18,fontWeight:'600',marginBottom:12},r:{flexDirection:'row',gap:12,marginBottom:16},b:{flex:1,padding:12,borderRadius:8,borderWidth:1,borderColor:'#4A90D9',alignItems:'center'},ba:{backgroundColor:'#4A90D9'},bt:{color:'#4A90D9',fontWeight:'600',textTransform:'capitalize'},bta:{color:'#FFF'},g:{backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center'},gt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default ReportGenerator;
