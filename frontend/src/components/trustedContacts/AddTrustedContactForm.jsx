import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
const AddTrustedContactForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', relationship: '' });
  const u = (k, v) => setForm({ ...form, [k]: v });
  return (
    <ScrollView style={s.c}>
      <Text style={s.t}>Add Trusted Contact</Text>
      {[['name','Full Name'],['phone','Phone Number'],['email','Email'],['relationship','Relationship']].map(([k,l])=>(
        <TextInput key={k} style={s.i} placeholder={l} value={form[k]} onChangeText={v=>u(k,v)} keyboardType={k==='phone'?'phone-pad':k==='email'?'email-address':'default'} />
      ))}
      <TouchableOpacity style={s.b} onPress={() => onSubmit?.(form)}><Text style={s.bt}>Add Contact</Text></TouchableOpacity>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderColor:'#DDD',borderRadius:8,padding:12,fontSize:16,marginBottom:12,backgroundColor:'#FFF'},b:{backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center',marginTop:8},bt:{color:'#FFF',fontWeight:'600',fontSize:16}});
export default AddTrustedContactForm;
