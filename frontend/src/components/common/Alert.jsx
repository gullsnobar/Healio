import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VARIANT_CONFIG = {
  success: { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' },
  error: { bg: '#FFEBEE', text: '#C62828', icon: 'alert-circle' },
  warning: { bg: '#FFF8E1', text: '#F57F17', icon: 'warning' },
  info: { bg: '#E3F2FD', text: '#1565C0', icon: 'information-circle' },
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
    <View style={[styles.container, { backgroundColor: config.bg }, style]}>
      <Ionicons name={config.icon} size={22} color={config.text} style={styles.icon} />
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={20} color={config.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Alert;
