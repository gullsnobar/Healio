import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Dimensions,
  ActivityIndicator,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { logoutUser } from '../../redux/slices/authSlice';
import { useAppTheme } from '../../styles/ThemeContext';
import { userAPI } from '../../services/api/userAPI';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male', icon: 'male-outline' },
  { label: 'Female', value: 'female', icon: 'female-outline' },
  { label: 'Prefer not to say', value: 'other', icon: 'person-outline' },
];

// ─── Section Header ────────────────────────────────────────────────────────
const SectionHeader = ({ title, colors }) => (
  <View style={sh.row}>
    <Text style={[sh.title, { color: colors.textTertiary }]}>{title.toUpperCase()}</Text>
    <View style={[sh.line, { backgroundColor: colors.border }]} />
  </View>
);
const sh = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 28 },
  title: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginRight: 10 },
  line: { flex: 1, height: 1 },
});

// ─── Editable Text Row ─────────────────────────────────────────────────────
const EditableRow = ({ icon, label, value, onChangeText, placeholder, keyboardType = 'default',
  autoCapitalize = 'sentences', editable = true, colors, isLast }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[er.wrap, {
      backgroundColor: focused ? colors.card : colors.background,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    }]}>
      <View style={[er.iconBox, { backgroundColor: focused ? colors.primary + '18' : colors.primary + '0D' }]}>
        <Ionicons name={icon} size={17} color={focused ? colors.primary : colors.textTertiary} />
      </View>
      <View style={er.content}>
        <Text style={[er.label, { color: colors.textTertiary }]}>{label}</Text>
        {editable ? (
          <TextInput
            style={[er.input, { color: colors.text }, Platform.OS === 'web' && { outlineStyle: 'none' }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            placeholderTextColor={colors.textTertiary}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <Text style={[er.value, { color: value ? colors.text : colors.textTertiary }]}>
            {value || '—'}
          </Text>
        )}
      </View>
      {editable && (
        <Ionicons name="pencil-outline" size={14} color={focused ? colors.primary : colors.border} />
      )}
    </View>
  );
};
const er = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 3 },
  input: { fontSize: 15, fontWeight: '500', padding: 0, margin: 0 },
  value: { fontSize: 15, fontWeight: '500' },
});

// ─── Gender Picker Row ─────────────────────────────────────────────────────
const GenderRow = ({ value, onSelect, colors, isLast }) => {
  const [open, setOpen] = useState(false);
  const selected = GENDER_OPTIONS.find(o => o.value === value);

  return (
    <>
      <TouchableOpacity
        style={[er.wrap, {
          backgroundColor: colors.background,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <View style={[er.iconBox, { backgroundColor: colors.primary + '0D' }]}>
          <Ionicons name="male-female-outline" size={17} color={colors.textTertiary} />
        </View>
        <View style={er.content}>
          <Text style={[er.label, { color: colors.textTertiary }]}>Gender</Text>
          <Text style={[er.value, { color: selected ? colors.text : colors.textTertiary }]}>
            {selected?.label || 'Select gender'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      {/* Gender picker modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={gm.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={[gm.sheet, { backgroundColor: colors.card }]}>
            {/* Handle bar */}
            <View style={[gm.handle, { backgroundColor: colors.border }]} />
            <Text style={[gm.title, { color: colors.text }]}>Select Gender</Text>

            {GENDER_OPTIONS.map((opt, i) => {
              const isSelected = value === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    gm.option,
                    { borderBottomColor: colors.border, borderBottomWidth: i < GENDER_OPTIONS.length - 1 ? StyleSheet.hairlineWidth : 0 },
                    isSelected && { backgroundColor: colors.primary + '10' },
                  ]}
                  onPress={() => { onSelect(opt.value); setOpen(false); }}
                  activeOpacity={0.7}
                >
                  <View style={[gm.optIcon, { backgroundColor: isSelected ? colors.primary + '18' : colors.border + '60' }]}>
                    <Ionicons name={opt.icon} size={20} color={isSelected ? colors.primary : colors.textTertiary} />
                  </View>
                  <Text style={[gm.optLabel, { color: isSelected ? colors.primary : colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={[gm.cancelBtn, { borderColor: colors.border }]} onPress={() => setOpen(false)}>
              <Text style={[gm.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
const gm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.3 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  optIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optLabel: { flex: 1, fontSize: 16 },
  cancelBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600' },
});

// ─── Date of Birth Row ─────────────────────────────────────────────────────
const DOBRow = ({ value, onChange, colors, isLast }) => {
  const [show, setShow] = useState(false);

  const parsed = value ? new Date(value) : null;
  const isValid = parsed && !isNaN(parsed.getTime());

  const displayValue = isValid
    ? parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShow(false);
    if (event?.type === 'dismissed') return;
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      onChange(`${y}-${m}-${d}`);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[er.wrap, {
        backgroundColor: colors.background,
        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }]}>
        <View style={[er.iconBox, { backgroundColor: colors.primary + '0D' }]}>
          <Ionicons name="calendar-outline" size={17} color={colors.textTertiary} />
        </View>
        <View style={er.content}>
          <Text style={[er.label, { color: colors.textTertiary }]}>Date of Birth</Text>
          <TextInput
            style={[er.input, { color: colors.text }, { outlineStyle: 'none' }]}
            value={value || ''}
            onChangeText={onChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textTertiary}
            type="date"
          />
        </View>
        <Ionicons name="pencil-outline" size={14} color={colors.border} />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[er.wrap, {
          backgroundColor: colors.background,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        }]}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <View style={[er.iconBox, { backgroundColor: colors.primary + '0D' }]}>
          <Ionicons name="calendar-outline" size={17} color={colors.textTertiary} />
        </View>
        <View style={er.content}>
          <Text style={[er.label, { color: colors.textTertiary }]}>Date of Birth</Text>
          <Text style={[er.value, { color: displayValue ? colors.text : colors.textTertiary }]}>
            {displayValue || 'Tap to select date'}
          </Text>
        </View>
        <Ionicons name={show ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={isValid ? parsed : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
};

// ─── Menu Row ──────────────────────────────────────────────────────────────
const MenuRow = ({ icon, label, value, onPress, iconBg, iconColor, rightElement, colors, isLast }) => (
  <TouchableOpacity
    style={[mr.row, {
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
    }]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={[mr.iconBox, { backgroundColor: iconBg || colors.primary + '18' }]}>
      <Ionicons name={icon} size={18} color={iconColor || colors.primary} />
    </View>
    <View style={mr.mid}>
      <Text style={[mr.label, { color: colors.text }]}>{label}</Text>
      {value ? <Text style={[mr.value, { color: colors.textTertiary }]}>{value}</Text> : null}
    </View>
    {rightElement !== undefined ? rightElement : (onPress && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />)}
  </TouchableOpacity>
);
const mr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mid: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500' },
  value: { fontSize: 12, marginTop: 1 },
});

// ─── Main Screen ───────────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', gender: '', dateOfBirth: '' });
  const [notifPrefs, setNotifPrefs] = useState({ medication: true, appointment: true, fitness: true, general: true });
  const [dirty, setDirty] = useState(false);

  const updateForm = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setDirty(true);
  };

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      const u = res.data?.data;
      setProfile(u);
      setForm({
        name: u?.name || '',
        phone: u?.phone || '',
        gender: u?.gender || '',
        dateOfBirth: u?.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
      });
      setNotifPrefs(u?.notificationPreferences || { medication: true, appointment: true, fitness: true, general: true });
      setDirty(false);
    } catch {
      const u = authUser;
      if (u) {
        setProfile(u);
        setForm({ name: u.name || '', phone: u.phone || '', gender: u.gender || '', dateOfBirth: u.dateOfBirth ? String(u.dateOfBirth).split('T')[0] : '' });
        setNotifPrefs(u.notificationPreferences || { medication: true, appointment: true, fitness: true, general: true });
      }
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // Save profile changes
  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Validation', 'Full name cannot be empty.'); return; }
    try {
      setSaving(true);
      await userAPI.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
      });
      await loadProfile();
      Alert.alert('✓ Saved', 'Your profile has been updated.');
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotifToggle = async (key) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(next);
    try { await userAPI.updateProfile({ notificationPreferences: next }); }
    catch { setNotifPrefs(notifPrefs); }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      try {
        const asset = result.assets[0];
        const fd = new FormData();
        fd.append('profileImage', { uri: asset.uri, name: 'profile.jpg', type: 'image/jpeg' });
        await userAPI.uploadProfileImage(fd);
        await loadProfile();
      } catch { Alert.alert('Error', 'Failed to upload image.'); }
    }
  };

  const handleLogout = () => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign Out', style: 'destructive', onPress: () => dispatch(logoutUser()) },
  ]);

  const handleDeleteAccount = () => Alert.alert('Delete Account', 'This is permanent and cannot be undone. All your data will be removed.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => { try { await userAPI.deleteAccount(); dispatch(logoutUser()); } catch { Alert.alert('Error', 'Could not delete account.'); } } },
  ]);

  const initials = (form.name || authUser?.name || 'U').charAt(0).toUpperCase();
  const displayEmail = profile?.email || authUser?.email || '';
  const avatarUri = profile?.profileImage || profile?.profilePicture;
  const px = IS_SMALL ? 16 : 20;

  if (loading) {
    return (
      <SafeAreaView style={[s.c, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={{ marginTop: 80 }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.c, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <ScrollView
        contentContainerStyle={[s.content, { paddingHorizontal: px }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Top Bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[s.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.pageTitle, { color: colors.text }]}>My Profile</Text>
          {/* Save button — visible only when dirty */}
          {dirty ? (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[s.saveTopBtn, { backgroundColor: colors.primary }]}
            >
              {saving
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={s.saveTopText}>Save</Text>
              }
            </TouchableOpacity>
          ) : (
            <View style={{ width: 56 }} />
          )}
        </View>

        {/* ── Hero Card ── */}
        <LinearGradient
          colors={isDark ? [colors.primary + 'CC', colors.primary + '55'] : [colors.primary, colors.primary + 'BB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.heroCard}
        >
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.85} style={s.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatarImg} />
            ) : (
              <View style={[s.avatarFallback, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Text style={s.avatarInitial}>{initials}</Text>
              </View>
            )}
            <View style={s.cameraTag}>
              <Ionicons name="camera" size={13} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={s.heroName}>{form.name || 'User'}</Text>
          <Text style={s.heroEmail}>{displayEmail}</Text>

          <View style={s.statsStrip}>
            {[
              { icon: 'calendar-outline', label: 'Member since', value: profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '—' },
              { icon: 'shield-checkmark-outline', label: 'Status', value: profile?.isVerified ? 'Verified' : 'Unverified' },
              { icon: 'language-outline', label: 'Language', value: profile?.preferredLanguage === 'ur' ? 'Urdu' : 'English' },
            ].map((stat, i) => (
              <View key={i} style={[s.stat, i < 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.25)' }]}>
                <Ionicons name={stat.icon} size={14} color="rgba(255,255,255,0.85)" />
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Personal Info (always editable) ── */}
        <SectionHeader title="Personal Info" colors={colors} />
        <View style={[s.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <EditableRow
            icon="person-outline"
            label="Full Name"
            value={form.name}
            onChangeText={(v) => updateForm('name', v)}
            placeholder="Your full name"
            autoCapitalize="words"
            colors={colors}
          />
          <EditableRow
            icon="mail-outline"
            label="Email Address"
            value={displayEmail}
            editable={false}
            colors={colors}
          />
          <EditableRow
            icon="call-outline"
            label="Phone Number"
            value={form.phone}
            onChangeText={(v) => updateForm('phone', v)}
            placeholder="+92 300 0000000"
            keyboardType="phone-pad"
            autoCapitalize="none"
            colors={colors}
          />
          <GenderRow
            value={form.gender}
            onSelect={(v) => updateForm('gender', v)}
            colors={colors}
          />
          <DOBRow
            value={form.dateOfBirth}
            onChange={(v) => updateForm('dateOfBirth', v)}
            colors={colors}
            isLast
          />
        </View>

        {/* Save button below info card */}
        {dirty && (
          <TouchableOpacity
            style={[s.saveCard, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={s.saveCardText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* ── Health Info ── */}
        {(profile?.healthConditions?.length > 0 || profile?.allergies?.length > 0) && (
          <>
            <SectionHeader title="Health Info" colors={colors} />
            <View style={[s.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {profile?.healthConditions?.length > 0 && (
                <View style={[er.wrap, { borderBottomWidth: profile?.allergies?.length > 0 ? StyleSheet.hairlineWidth : 0, borderBottomColor: colors.border }]}>
                  <View style={[er.iconBox, { backgroundColor: '#14B8A60D' }]}>
                    <Ionicons name="fitness-outline" size={17} color="#14B8A6" />
                  </View>
                  <View style={er.content}>
                    <Text style={[er.label, { color: colors.textTertiary }]}>Health Conditions</Text>
                    <Text style={[er.value, { color: colors.text }]}>{profile.healthConditions.join(', ')}</Text>
                  </View>
                </View>
              )}
              {profile?.allergies?.length > 0 && (
                <View style={er.wrap}>
                  <View style={[er.iconBox, { backgroundColor: '#EF44440D' }]}>
                    <Ionicons name="alert-circle-outline" size={17} color="#EF4444" />
                  </View>
                  <View style={er.content}>
                    <Text style={[er.label, { color: colors.textTertiary }]}>Allergies</Text>
                    <Text style={[er.value, { color: colors.text }]}>{profile.allergies.join(', ')}</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* ── Notification Preferences ── */}
        <SectionHeader title="Notifications" colors={colors} />
        <View style={[s.menuCard, { borderColor: colors.border }]}>
          {[
            { key: 'medication', icon: 'medkit-outline', label: 'Medication Reminders', iconBg: '#14B8A618', iconColor: '#14B8A6' },
            { key: 'appointment', icon: 'calendar-outline', label: 'Appointment Alerts', iconBg: '#6366F118', iconColor: '#6366F1' },
            { key: 'fitness', icon: 'barbell-outline', label: 'Fitness Updates', iconBg: '#F59E0B18', iconColor: '#F59E0B' },
            { key: 'general', icon: 'notifications-outline', label: 'General Notifications', iconBg: '#EC489918', iconColor: '#EC4899' },
          ].map((item, i, arr) => (
            <MenuRow
              key={item.key}
              icon={item.icon}
              label={item.label}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              colors={colors}
              isLast={i === arr.length - 1}
              rightElement={
                <Switch
                  value={!!notifPrefs[item.key]}
                  onValueChange={() => handleNotifToggle(item.key)}
                  trackColor={{ false: colors.border, true: item.iconColor + '88' }}
                  thumbColor={notifPrefs[item.key] ? item.iconColor : colors.textTertiary}
                />
              }
            />
          ))}
        </View>

        {/* ── Account ── */}
        <SectionHeader title="Account" colors={colors} />
        <View style={[s.menuCard, { borderColor: colors.border }]}>
          <MenuRow icon="settings-outline" label="Settings" value="Reminders, appearance & more" colors={colors} onPress={() => navigation.navigate('Settings')} />
          <MenuRow icon="people-outline" label="Trusted Contacts" value="Emergency contacts" colors={colors} onPress={() => navigation.navigate('TrustedContacts')} />
          <MenuRow icon="lock-closed-outline" label="Privacy Settings" colors={colors} onPress={() => navigation.navigate('PrivacySettings')} />
          <MenuRow icon="shield-outline" label="Change Password" colors={colors} onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon.')} isLast />
        </View>

        {/* ── Sign Out ── */}
        <SectionHeader title="Session" colors={colors} />
        <View style={[s.menuCard, { borderColor: colors.border }]}>
          <MenuRow icon="log-out-outline" label="Sign Out" iconBg="#F9731618" iconColor="#F97316" colors={colors} onPress={handleLogout} isLast />
        </View>

        {/* ── Danger Zone ── */}
        <View style={[s.dangerCard, { borderColor: '#EF444440', backgroundColor: '#EF444408' }]}>
          <View style={s.dangerHeader}>
            <Ionicons name="warning-outline" size={16} color="#EF4444" />
            <Text style={s.dangerTitle}>Danger Zone</Text>
          </View>
          <Text style={[s.dangerDesc, { color: colors.textTertiary }]}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          <TouchableOpacity style={s.dangerBtn} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={s.dangerBtnText}>Delete My Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.footerNote, { color: colors.textTertiary }]}>Healio • v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingBottom: 48 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: IS_SMALL ? 8 : 12, paddingBottom: IS_SMALL ? 12 : 16,
  },
  iconBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pageTitle: { fontSize: IS_SMALL ? 17 : 19, fontWeight: '800', letterSpacing: -0.3 },
  saveTopBtn: { height: 36, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minWidth: 56 },
  saveTopText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  heroCard: { borderRadius: 24, alignItems: 'center', paddingTop: 28, paddingBottom: 0, overflow: 'hidden', marginBottom: 4 },
  avatarWrap: { marginBottom: 12 },
  avatarImg: { width: IS_SMALL ? 88 : 100, height: IS_SMALL ? 88 : 100, borderRadius: IS_SMALL ? 44 : 50, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarFallback: { width: IS_SMALL ? 88 : 100, height: IS_SMALL ? 88 : 100, borderRadius: IS_SMALL ? 44 : 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)' },
  avatarInitial: { fontSize: IS_SMALL ? 36 : 44, fontWeight: '800', color: '#fff' },
  cameraTag: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  heroName: { fontSize: IS_SMALL ? 20 : 24, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 3, marginBottom: 20 },
  statsStrip: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.18)', width: '100%', paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },

  infoCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  menuCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },

  saveCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 14, height: 50, marginTop: 12,
  },
  saveCardText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  dangerCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 28 },
  dangerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dangerTitle: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  dangerDesc: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#EF4444', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  dangerBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },

  footerNote: { textAlign: 'center', fontSize: 11, marginTop: 24 },
});

export default ProfileScreen;
