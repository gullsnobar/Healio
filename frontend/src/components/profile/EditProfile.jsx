import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Dropdown from '../common/Dropdown';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDER_OPTIONS = ['male', 'female', 'other'];

const EditProfile = ({ user, onSubmit, loading = false }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({
    name: user?.name || user?.fullName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).split('T')[0] : '',
    bloodGroup: user?.bloodGroup || '',
    gender: user?.gender || '',
  });
  const [focused, setFocused] = useState(null);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const fields = [
    { key: 'name', label: 'Full Name', icon: 'person-outline', placeholder: 'Your full name', autoCapitalize: 'words', keyboard: 'default' },
    { key: 'phone', label: 'Phone Number', icon: 'call-outline', placeholder: '+92 300 0000000', keyboard: 'phone-pad' },
  ];

  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={[s.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[s.headerIcon, { backgroundColor: colors.primary + '18' }]}>
          <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={[s.headerTitle, { color: colors.text }]}>Edit Profile</Text>
          <Text style={[s.headerSub, { color: colors.textTertiary }]}>Update your personal information</Text>
        </View>
      </View>

      <View style={s.form}>
        {/* Text fields */}
        {fields.map(({ key, label, icon, placeholder, autoCapitalize, keyboard }) => (
          <View key={key} style={s.fieldWrap}>
            <Text style={[s.label, { color: colors.textTertiary }]}>{label}</Text>
            <View style={[
              s.inputRow,
              { backgroundColor: focused === key ? colors.card : colors.cardAlt, borderColor: focused === key ? colors.primary : colors.border },
            ]}>
              <View style={[s.iconBox, { backgroundColor: (focused === key ? colors.primary : colors.textTertiary) + '18' }]}>
                <Ionicons name={icon} size={16} color={focused === key ? colors.primary : colors.textTertiary} />
              </View>
              <TextInput
                style={[s.input, { color: colors.text }, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                value={form[key]}
                onChangeText={(v) => update(key, v)}
                autoCapitalize={autoCapitalize ?? 'none'}
                keyboardType={keyboard ?? 'default'}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>
        ))}

        {/* Gender Dropdown */}
        <View style={s.fieldWrap}>
          <Dropdown
            label="Gender"
            value={form.gender}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
            onSelect={(v) => update('gender', v)}
          />
        </View>

        {/* Blood Group Dropdown */}
        <View style={s.fieldWrap}>
          <Dropdown
            label="Blood Group"
            value={form.bloodGroup}
            options={BLOOD_GROUPS}
            placeholder="Select blood group"
            onSelect={(v) => update('bloodGroup', v)}
          />
        </View>

        {/* Date of Birth */}
        <View style={s.fieldWrap}>
          <Dropdown
            label="Date of Birth"
            value={form.dateOfBirth}
            placeholder="Select date"
            mode="date"
            onChange={(v) => update('dateOfBirth', v)}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[s.saveBtn, { backgroundColor: colors.primary }]}
          onPress={() => onSubmit?.(form)}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={s.saveBtnText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  form: { paddingHorizontal: 16, paddingBottom: 40 },
  fieldWrap: { marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4, marginBottom: 6, marginLeft: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 12,
  },
  iconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    height: 52,
    marginTop: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default EditProfile;
