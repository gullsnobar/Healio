import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
const EditProfile = ({ user, onSubmit }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', dateOfBirth: user?.dateOfBirth || '', bloodGroup: user?.bloodGroup || '', emergencyContact: user?.emergencyContact || '' });
  const u = (k, v) => setForm({ ...form, [k]: v });
  return (
    <ScrollView style={s.c}><Text style={[s.t, { color: colors.text }]}>Edit Profile</Text>
    {[['fullName','Full Name'],['phone','Phone'],['dateOfBirth','Date of Birth'],['bloodGroup','Blood Group'],['emergencyContact','Emergency Contact']].map(([k,l])=>(
      <TextInput key={k} style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder={l} placeholderTextColor={colors.textTertiary} value={form[k]} onChangeText={v=>u(k,v)} />
    ))}
    <TouchableOpacity style={[s.b, { backgroundColor: colors.primary }]} onPress={()=>onSubmit?.(form)}><Text style={s.bt}>Save</Text></TouchableOpacity>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderRadius:8,padding:12,fontSize:16,marginBottom:12},b:{padding:14,borderRadius:8,alignItems:'center'},bt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default EditProfile;
