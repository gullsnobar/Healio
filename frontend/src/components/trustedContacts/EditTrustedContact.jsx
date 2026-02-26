import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
const EditTrustedContact = ({ contact, onSubmit, onDelete }) => {
  const [form, setForm] = useState(contact || {});
  const u = (k, v) => setForm({ ...form, [k]: v });
  return (
    <ScrollView style={s.c}>
      <Text style={s.t}>Edit Contact</Text>
      {[['name','Full Name'],['phone','Phone'],['email','Email'],['relationship','Relationship']].map(([k,l])=>(
        <TextInput key={k} style={s.i} placeholder={l} value={form[k]} onChangeText={v=>u(k,v)} />
      ))}
      <TouchableOpacity style={s.b} onPress={() => onSubmit?.(form)}><Text style={s.bt}>Save Changes</Text></TouchableOpacity>
      <TouchableOpacity style={s.d} onPress={() => Alert.alert('Delete','Remove this contact?',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>onDelete?.(contact._id)}])}><Text style={s.dt}>Remove Contact</Text></TouchableOpacity>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderColor:'#DDD',borderRadius:8,padding:12,fontSize:16,marginBottom:12,backgroundColor:'#FFF'},b:{backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center',marginTop:8},bt:{color:'#FFF',fontWeight:'600',fontSize:16},d:{padding:14,borderRadius:8,alignItems:'center',marginTop:8,borderWidth:1,borderColor:'#F44336'},dt:{color:'#F44336',fontWeight:'600'}});
export default EditTrustedContact;
