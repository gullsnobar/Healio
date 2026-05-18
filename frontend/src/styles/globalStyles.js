import { StyleSheet, Platform } from 'react-native';

// MR & FT – Global Style Utilities
// Neumorphism, Glassmorphism, Card, Shadow presets

export const globalStyles = StyleSheet.create({
  // Card (standard)
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },

  // Card (elevated)
  cardElevated: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },

  // Layout
  center: { alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1 },

  // Glass
  glassCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
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

  row: { alignItems: 'center', flexDirection: 'row' },
  screenPadding: { paddingHorizontal: 20 },

  // Shadow presets
  shadowLg: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },
  shadowMd: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  shadowSm: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  shadowXl: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24 },
      android: { elevation: 10 },
    }),
  },
});

export default globalStyles;
