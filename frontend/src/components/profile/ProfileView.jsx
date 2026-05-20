import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * ProfileView — compact card used by other screens to show user info.
 */
const ProfileView = ({ user, onEditPress }) => {
  const { colors, isDark } = useAppTheme();
  const initials = (user?.name || user?.fullName || 'U').charAt(0).toUpperCase();
  const avatarUri = user?.profileImage || user?.profilePicture;

  return (
    <LinearGradient
      colors={isDark ? [colors.primary + 'CC', colors.primary + '55'] : [colors.primary, colors.primary + 'CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.card}
    >
      {/* Avatar */}
      <View style={s.avatarWrap}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={s.img} />
        ) : (
          <View style={[s.fallback, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={s.initial}>{initials}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <Text style={s.name}>{user?.name || user?.fullName || 'User'}</Text>
      {user?.email ? <Text style={s.sub}>{user.email}</Text> : null}
      {user?.phone ? <Text style={s.sub}>{user.phone}</Text> : null}

      {/* Edit button */}
      {onEditPress && (
        <TouchableOpacity style={s.editBtn} onPress={onEditPress} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={15} color={colors.primary} />
          <Text style={[s.editText, { color: colors.primary }]}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 20,
  },
  avatarWrap: { marginBottom: 12 },
  img: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  fallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  initial: { fontSize: 38, fontWeight: '800', color: '#fff' },
  name: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  editText: { fontSize: 13, fontWeight: '700' },
});

export default ProfileView;
