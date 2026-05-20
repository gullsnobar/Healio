import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const MENU_ITEMS = [
  {
    key: 'password',
    icon: 'key-outline',
    label: 'Change Password',
    desc: 'Update your account password',
    iconBg: '#6366F118',
    iconColor: '#6366F1',
    actionKey: 'onChangePassword',
  },
  {
    key: 'logout',
    icon: 'log-out-outline',
    label: 'Sign Out',
    desc: 'Sign out of this device',
    iconBg: '#F9731618',
    iconColor: '#F97316',
    actionKey: 'onLogout',
  },
  {
    key: 'delete',
    icon: 'trash-outline',
    label: 'Delete Account',
    desc: 'Permanently remove your account',
    iconBg: '#EF444418',
    iconColor: '#EF4444',
    actionKey: 'onDeleteAccount',
    isDanger: true,
  },
];

const AccountSettings = ({ onChangePassword, onDeleteAccount, onLogout }) => {
  const { colors } = useAppTheme();

  const actions = { onChangePassword, onLogout, onDeleteAccount };

  const handlePress = (item) => {
    if (item.key === 'delete') {
      Alert.alert(
        'Delete Account',
        'This action is permanent and cannot be undone. All your data will be removed.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onDeleteAccount },
        ],
      );
    } else {
      actions[item.actionKey]?.();
    }
  };

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {MENU_ITEMS.map((item, i) => (
        <TouchableOpacity
          key={item.key}
          style={[
            s.row,
            i < MENU_ITEMS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
          ]}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}
        >
          <View style={[s.iconBox, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={19} color={item.iconColor} />
          </View>
          <View style={s.mid}>
            <Text style={[s.label, { color: item.isDanger ? '#EF4444' : colors.text }]}>
              {item.label}
            </Text>
            <Text style={[s.desc, { color: colors.textTertiary }]}>{item.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
});

export default AccountSettings;
