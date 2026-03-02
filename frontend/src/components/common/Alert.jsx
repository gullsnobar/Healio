import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VARIANT_CONFIG = {
  success: { bg: '#ECFDF5', border: '#A7F3D0', accent: '#059669', text: '#065F46', icon: 'checkmark-circle' },
  error:   { bg: '#FEF2F2', border: '#FECACA', accent: '#EF4444', text: '#991B1B', icon: 'alert-circle' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', accent: '#F59E0B', text: '#92400E', icon: 'warning' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', accent: '#3B82F6', text: '#1E40AF', icon: 'information-circle' },
};

const Alert = ({
  variant = 'info',
  message,
  onDismiss,
  style,
}) => {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;

  if (!message) return null;

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }, style]}>
      <View style={[styles.accentBar, { backgroundColor: config.accent }]} />
      <Ionicons name={config.icon} size={22} color={config.accent} style={styles.icon} />
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={config.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 18,
    marginVertical: 6,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Alert;
