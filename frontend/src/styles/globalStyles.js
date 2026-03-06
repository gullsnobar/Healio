import { StyleSheet, Platform } from 'react-native';

// HEALIO – Global Style Utilities
// Neumorphism, Glassmorphism, Card, Shadow presets

export const globalStyles = StyleSheet.create({
  // Layout
  container: { flex: 1 },
  screenPadding: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },

  // Card (standard)
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },

  // Card (elevated)
  cardElevated: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },

  // Shadow presets
  shadowSm: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  shadowMd: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  shadowLg: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },
  shadowXl: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24 },
      android: { elevation: 10 },
    }),
  },

  // Neumorphism
  neuCard: {
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#D1D9E6', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },

  // Glass
  glassCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default globalStyles;
