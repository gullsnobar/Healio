import { DefaultTheme } from 'react-native-paper';
import colors from './colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.card,
    error: colors.error,
    text: colors.text,
    placeholder: colors.grey,
  },
  roundness: 8,
  fonts: { ...DefaultTheme.fonts },
};
export default theme;
