import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../../redux/slices/authSlice';

const PRIMARY = '#0F766E';
const PRIMARY_DARK = '#0D6560';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
      });
    }
  }, [user]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const initials = (user?.name || user?.fullName || 'U').charAt(0).toUpperCase();

  const renderField = (key, label, placeholder, extra = {}) => (
    <View key={key} style={{ marginBottom: 14 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.inputWrap, focusedField === key && s.inputFocused]}>
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={form[key]}
          onChangeText={(v) => update(key, v)}
          autoCapitalize={extra.autoCapitalize ?? 'none'}
          keyboardType={extra.keyboardType ?? 'default'}
          secureTextEntry={extra.secure}
          onFocus={() => setFocusedField(key)}
          onBlur={() => setFocusedField(null)}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={s.c} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Avatar */}
      <View style={s.avatarSection}>
        <View style={s.avatarCircle}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={s.avatarImg} />
          ) : (
            <Text style={s.avatarText}>{initials}</Text>
          )}
        </View>
        <Text style={s.userName}>{user?.name || user?.fullName || 'User'}</Text>
      </View>

      {/* Form fields */}
      <View style={s.formSection}>
        {renderField('username', 'Username', 'Enter username', { autoCapitalize: 'words' })}
        {renderField('email', 'Email', 'Enter email', { keyboardType: 'email-address' })}
        {renderField('phone', 'Phone', 'Enter phone', { keyboardType: 'phone-pad' })}
        {renderField('gender', 'Gender', 'Male / Female / Other')}
        {renderField('dateOfBirth', 'Date of Birth', 'YYYY-MM-DD')}
      </View>

      {/* Save button */}
      <View style={s.formSection}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient colors={[PRIMARY, PRIMARY_DARK]} style={s.saveBtn}>
            <Text style={s.saveBtnText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity onPress={handleLogout} style={s.signOutBtn} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={s.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 40 },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },

  /* Avatar */
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },

  /* Form */
  formSection: { paddingHorizontal: 24 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    height: 56,
  },
  inputFocused: { borderColor: PRIMARY, backgroundColor: '#FFF' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    letterSpacing: 0.2,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },

  /* Save */
  saveBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  /* Sign out */
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    marginTop: 16,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});

export default ProfileScreen;
