import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
const ContactAlertSettings = ({ settings, onUpdate }) => {
  const [s2, setS] = useState(settings || { missedDose: true, appointment: true, emergency: true });
  const toggle = (k) => { const n = { ...s2, [k]: !s2[k] }; setS(n); onUpdate?.(n); };
  return (
    <View style={s.c}><Text style={s.t}>Alert Settings</Text>
    {[['missedDose','Missed Dose Alerts'],['appointment','Appointment Alerts'],['emergency','Emergency Alerts']].map(([k,l])=>(
      <View key={k} style={s.r}><Text style={s.l}>{l}</Text><Switch value={s2[k]} onValueChange={()=>toggle(k)} trackColor={{true:'#4A90D9'}} /></View>
    ))}</View>
  );
};
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:16,elevation:2},t:{fontSize:16,fontWeight:'600',marginBottom:12},r:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F0F0F0'},l:{fontSize:15,color:'#333'}});
export default ContactAlertSettings;
