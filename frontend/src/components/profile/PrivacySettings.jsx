import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
const PrivacySettings = ({ settings, onUpdate, disabled }) => {
  const { colors } = useAppTheme();
  const [s2, setS] = useState(settings || { shareWithContacts: true, dataCollection: true, locationTracking: false });
  useEffect(() => {
    if (settings) setS((prev) => ({ ...prev, ...settings }));
  }, [settings]);
  const toggle = (k) => { const n = { ...s2, [k]: !s2[k] }; setS(n); onUpdate?.(n); };
  return (
    <View style={[s.c, { backgroundColor: colors.card }]}>{[['shareWithContacts','Share Data with Contacts'],['dataCollection','Allow Data Collection'],['locationTracking','Location Tracking']].map(([k,l])=>(
      <View key={k} style={[s.r, { borderBottomColor: colors.borderLight }]}><Text style={[s.l, { color: colors.text }]}>{l}</Text><Switch value={!!s2[k]} onValueChange={()=>!disabled && toggle(k)} trackColor={{true:colors.primary}} disabled={disabled} /></View>
    ))}</View>
  );
};
const s = StyleSheet.create({c:{borderRadius:12,padding:16},r:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1},l:{fontSize:15}});
export default PrivacySettings;
