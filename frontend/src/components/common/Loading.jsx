import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const Loading = ({ message, size = 'large', style, overlay = false }) => {
  const { colors: themeColors } = useAppTheme();
  const color = themeColors.primary;

  if (overlay) {
    return (
      <View style={[styles.overlay, style]}>
        <View style={[styles.overlayCard, { backgroundColor: themeColors.card }]}>
          <ActivityIndicator size={size} color={color} />
          {!!message && <Text style={[styles.overlayMessage, { color: themeColors.textSecondary }]}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }, style]}>
      <ActivityIndicator size={size} color={color} />
      {!!message && <Text style={[styles.message, { color: themeColors.textSecondary }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  message: {
    marginTop: 14,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayCard: {
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  overlayMessage: {
    marginTop: 14,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Loading;
