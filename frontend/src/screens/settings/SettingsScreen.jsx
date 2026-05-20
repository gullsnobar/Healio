import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const SECTIONS = [
  {
    title: 'Health & Activity',
    items: [
      { icon: 'alarm-outline', label: 'Reminders', desc: 'Medication & appointment alerts', route: 'Reminders', iconBg: '#14B8A618', iconColor: '#14B8A6' },
      { icon: 'notifications-outline', label: 'Notification Settings', desc: 'Manage push notifications', route: 'NotificationSettings', iconBg: '#6366F118', iconColor: '#6366F1' },
    ],
  },
  {
    title: 'App Preferences',
    items: [
      { icon: 'color-palette-outline', label: 'Appearance', desc: 'Theme, colors & display', route: 'Appearance', iconBg: '#EC489918', iconColor: '#EC4899' },
      { icon: 'language-outline', label: 'Language', desc: 'App language preference', route: null, iconBg: '#F59E0B18', iconColor: '#F59E0B' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: 'lock-closed-outline', label: 'Privacy Settings', desc: 'Data sharing & location', route: 'PrivacySettings', iconBg: '#8B5CF618', iconColor: '#8B5CF6' },
      { icon: 'people-outline', label: 'Trusted Contacts', desc: 'Emergency contact management', route: 'TrustedContacts', iconBg: '#F9731618', iconColor: '#F97316' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'information-circle-outline', label: 'About Healio', desc: 'Version info & credits', route: 'About', iconBg: '#0EA5E918', iconColor: '#0EA5E9' },
    ],
  },
];

const SettingsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[s.c, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {SECTIONS.map((section) => (
        <View key={section.title} style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textTertiary }]}>
            {section.title.toUpperCase()}
          </Text>
          <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  s.row,
                  i < section.items.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                  !item.route && s.disabled,
                ]}
                onPress={() => item.route && navigation.navigate(item.route)}
                activeOpacity={item.route ? 0.7 : 1}
              >
                <View style={[s.iconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View style={s.mid}>
                  <Text style={[s.label, { color: colors.text }]}>{item.label}</Text>
                  <Text style={[s.desc, { color: colors.textTertiary }]}>{item.desc}</Text>
                </View>
                {item.route ? (
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                ) : (
                  <View style={[s.comingSoon, { backgroundColor: colors.primary + '18' }]}>
                    <Text style={[s.comingSoonText, { color: colors.primary }]}>Soon</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  content: { padding: IS_SMALL ? 14 : 16, paddingBottom: 40 },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  disabled: { opacity: 0.6 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1 },
  label: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
  comingSoon: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: { fontSize: 11, fontWeight: '700' },
});

export default SettingsScreen;
