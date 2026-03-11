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
import { logoutUser } from '../../redux/slices/authSlice';
import { useAppTheme } from '../../styles/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
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
      { text: 'Sign Out', style: 'destructive', onPress: () => dispatch(logoutUser()) },
    ]);
  };

  const initials = (user?.name || user?.fullName || 'U').charAt(0).toUpperCase();

  const renderField = (key, label, placeholder, extra = {}) => (
    <View key={key} style={{ marginBottom: 14 }}>
      <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[s.inputWrap, { backgroundColor: colors.cardAlt, borderColor: colors.cardAlt },
        focusedField === key && { borderColor: colors.primary, backgroundColor: colors.card }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
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
    <ScrollView style={[s.c, { backgroundColor: colors.background }]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.topTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Avatar */}
      <View style={s.avatarSection}>
        <View style={[s.avatarCircle, { backgroundColor: colors.primary }]}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={s.avatarImg} />
          ) : (
            <Text style={s.avatarText}>{initials}</Text>
          )}
        </View>
        <Text style={[s.userName, { color: colors.text }]}>{user?.name || user?.fullName || 'User'}</Text>
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
          <LinearGradient colors={colors.primaryGrad} style={s.saveBtn}>
            <Text style={s.saveBtnText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Dark mode toggle */}

      {/* Sign out */}
      <TouchableOpacity onPress={handleLogout} style={s.signOutBtn} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={[s.signOutText, { color: colors.error }]}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topTitle: { fontSize: 18, fontWeight: '700' },

  /* Avatar */
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },

  /* Form */
  formSection: { paddingHorizontal: 24 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
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
    shadowColor: '#14B8A6',
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
  signOutText: { fontSize: 15, fontWeight: '700' },
});

export default ProfileScreen;
