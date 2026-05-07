import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';

const RELATIONSHIP_OPTIONS = [
  { label: 'Family', value: 'family' },
  { label: 'Friend', value: 'friend' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Caregiver', value: 'caregiver' },
  { label: 'Other', value: 'other' },
];

const AddTrustedContactForm = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({ name: '', phone: '', email: '', relationship: '' });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  
  const handleSubmit = async () => {
    const name = (form.name || '').trim();
    const email = (form.email || '').trim();
    const relationship = form.relationship;
    const phone = (form.phone || '').trim();

    if (!name) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    if (!email) {
      Alert.alert('Validation', 'Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Validation', 'Please enter a valid email');
      return;
    }
    if (!relationship) {
      Alert.alert('Validation', 'Please select relationship');
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.({
        name,
        email,
        phone,
        relationship,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={s.c} keyboardShouldPersistTaps="handled">
      <Text style={[s.t, { color: colors.text }]}>Add Trusted Contact</Text>
      <TextInput
        style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        placeholder="Full Name"
        placeholderTextColor={colors.textTertiary}
        value={form.name}
        onChangeText={(v) => u('name', v)}
        autoCapitalize="words"
      />
      <TextInput
        style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        placeholder="Phone Number (optional)"
        placeholderTextColor={colors.textTertiary}
        value={form.phone}
        onChangeText={(v) => u('phone', v)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[s.i, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.textTertiary}
        value={form.email}
        onChangeText={(v) => u('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Dropdown
        label="Relationship"
        value={form.relationship}
        options={RELATIONSHIP_OPTIONS}
        placeholder="Select relationship"
        onSelect={(v) => u('relationship', v)}
        required
      />
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
