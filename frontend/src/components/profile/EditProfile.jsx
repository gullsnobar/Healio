import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
const EditProfile = ({ user, onSubmit }) => {
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', dateOfBirth: user?.dateOfBirth || '', bloodGroup: user?.bloodGroup || '', emergencyContact: user?.emergencyContact || '' });
  const u = (k, v) => setForm({ ...form, [k]: v });
  return (
    <ScrollView style={s.c}><Text style={s.t}>Edit Profile</Text>
    {[['fullName','Full Name'],['phone','Phone'],['dateOfBirth','Date of Birth'],['bloodGroup','Blood Group'],['emergencyContact','Emergency Contact']].map(([k,l])=>(
      <TextInput key={k} style={s.i} placeholder={l} value={form[k]} onChangeText={v=>u(k,v)} />
    ))}
    <TouchableOpacity style={s.b} onPress={()=>onSubmit?.(form)}><Text style={s.bt}>Save</Text></TouchableOpacity>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderColor:'#DDD',borderRadius:8,padding:12,fontSize:16,marginBottom:12,backgroundColor:'#FFF'},b:{backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center'},bt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default EditProfile;
