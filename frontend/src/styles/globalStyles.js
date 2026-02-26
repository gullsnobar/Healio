import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

export const globalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screenPadding: { padding: spacing.screenPadding },
  card: { backgroundColor: colors.card, borderRadius: spacing.borderRadius.lg, padding: spacing.cardPadding, elevation: 2, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
});
export default globalStyles;
