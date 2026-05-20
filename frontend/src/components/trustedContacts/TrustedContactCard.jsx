import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const TrustedContactCard = ({ contact, onPress, onDelete }) => {
  const { colors } = useAppTheme();

  const handlePress = () => {
    if (contact) onPress?.(contact);
  };

  const handleDelete = (e) => {
    e?.stopPropagation?.(); // prevents card press conflict
    if (contact) onDelete?.(contact);
  };

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={[s.avatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={24} color="#fff" />
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={[s.name, { color: colors.text }]}>
          {contact?.name || 'Unknown'}
        </Text>

        <Text style={[s.relationship, { color: colors.textTertiary }]}>
          {contact?.relationship || 'No relationship'}
        </Text>

        <Text style={[s.phone, { color: colors.primary }]}>
          {contact?.phone || 'No phone'}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default memo(TrustedContactCard);

// ---------------- STYLES ----------------

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  relationship: {
    fontSize: 13,
    marginTop: 2,
  },
  phone: {
    fontSize: 13,
    marginTop: 2,
  },
});