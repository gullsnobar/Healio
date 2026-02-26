import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
const PrivacySettings = ({ settings, onUpdate }) => {
  const [s2, setS] = useState(settings || { shareWithContacts: true, dataCollection: true, locationTracking: false });
  const toggle = (k) => { const n = { ...s2, [k]: !s2[k] }; setS(n); onUpdate?.(n); };
  return (
    <View style={s.c}>{[['shareWithContacts','Share Data with Contacts'],['dataCollection','Allow Data Collection'],['locationTracking','Location Tracking']].map(([k,l])=>(
      <View key={k} style={s.r}><Text style={s.l}>{l}</Text><Switch value={s2[k]} onValueChange={()=>toggle(k)} trackColor={{true:'#4A90D9'}} /></View>
    ))}</View>
  );
};
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:16},r:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#F0F0F0'},l:{fontSize:15,color:'#333'}});
export default PrivacySettings;
