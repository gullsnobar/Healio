import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
const EditTrustedContact = ({ contact, onSubmit, onDelete }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState(contact || {});
  
  const u = (k, v) => setForm({ ...form, [k]: v });
  return (
    <ScrollView style={s.c}>
      <Text style={[s.t, { color: colors.text }]}>Edit Contact</Text>
      {[['name','Full Name'],['phone','Phone'],['email','Email'],['relationship','Relationship']].map(([k,l])=>(
        <TextInput key={k} style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder={l} placeholderTextColor={colors.textTertiary} value={form[k]} onChangeText={v=>u(k,v)} />
      ))}
      <TouchableOpacity style={[s.b, { backgroundColor: colors.primary }]} onPress={() => onSubmit?.(form)}><Text style={s.bt}>Save Changes</Text></TouchableOpacity>
      <TouchableOpacity style={[s.d, { borderColor: colors.error }]} onPress={() => Alert.alert('Delete','Remove this contact?',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>onDelete?.(contact._id)}])}><Text style={[s.dt, { color: colors.error }]}>Remove Contact</Text></TouchableOpacity>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderRadius:8,padding:12,fontSize:16,marginBottom:12},b:{padding:14,borderRadius:8,alignItems:'center',marginTop:8},bt:{color:'#FFF',fontWeight:'600',fontSize:16},d:{padding:14,borderRadius:8,alignItems:'center',marginTop:8,borderWidth:1},dt:{fontWeight:'600'}});
export default EditTrustedContact;
