import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * ProfilePictureUpload
 * Renders the avatar + an overlaid camera button.
 * Tapping anywhere triggers onPick.
 */
const ProfilePictureUpload = ({ imageUri, onPick, uploading = false, initials = 'U' }) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity style={s.wrap} onPress={onPick} activeOpacity={0.85}>
      {/* Avatar */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={s.img} />
      ) : (
        <View style={[s.fallback, { backgroundColor: colors.primary }]}>
          <Text style={s.initial}>{initials.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      {/* Camera overlay badge */}
      <View style={[s.badge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="camera" size={14} color="#fff" />
        )}
      </View>

      {/* Hint label */}
      <Text style={[s.hint, { color: colors.textTertiary }]}>
        {uploading ? 'Uploading…' : 'Tap to change'}
      </Text>
    </TouchableOpacity>
  );
};

const AVATAR = 104;

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: 20,
  },
  img: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
  },
  fallback: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    bottom: 26,
    right: '50%',
    marginRight: -(AVATAR / 2) + 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default ProfilePictureUpload;
