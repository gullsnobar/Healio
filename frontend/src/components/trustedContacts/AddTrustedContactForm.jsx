import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';

const AddTrustedContactForm = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({ name: '', phone: '', email: '', relationship: '' });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm({ ...form, [k]: v });
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit?.(form);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={s.c}>
      <Text style={[s.t, { color: colors.text }]}>Add Trusted Contact</Text>
      {[['name','Full Name'],['phone','Phone Number'],['email','Email'],['relationship','Relationship']].map(([k,l])=>(
        <TextInput key={k} style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder={l} placeholderTextColor={colors.textTertiary} value={form[k]} onChangeText={v=>u(k,v)} keyboardType={k==='phone'?'phone-pad':k==='email'?'email-address':'default'} />
      ))}
      <Button
        variant="primary"
        size="large"
        icon="person-add"
        onPress={handleSubmit}
        loading={loading}
        colors={colors}
        style={{ marginTop: 8 }}
      >
        Add Contact
      </Button>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{padding:16},t:{fontSize:20,fontWeight:'700',marginBottom:16},i:{borderWidth:1,borderRadius:8,padding:12,fontSize:16,marginBottom:12}});
export default AddTrustedContactForm;
