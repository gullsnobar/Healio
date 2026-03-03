import { DefaultTheme } from 'react-native-paper';
import { light, dark } from './colors';

/*
 * react-native-paper v5 uses MD3 (Material Design 3) themes.
 * DefaultTheme === MD3LightTheme.  DarkTheme is NOT exported as a named
 * export, so we build the dark variant by spreading DefaultTheme and
 * flipping `dark: true`.  Only the colour tokens we actually use in the
 * app are overridden; everything else inherits the MD3 defaults.
 */

// ── Light Paper theme (MD3) ──
export const lightTheme = {
  ...DefaultTheme,
  dark: false,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    // Brand
    primary:              light.primary,
    primaryContainer:     light.primaryLight,
    secondary:            light.secondary,
    secondaryContainer:   light.secondaryLight,
    tertiary:             light.accent,
    tertiaryContainer:    light.accentLight,
    // Surfaces
    surface:              light.card,
    surfaceVariant:       light.cardAlt,
    background:           light.background,
    // Semantic
    error:                light.error,
    errorContainer:       light.errorLight,
    // On-colours (text drawn on top of the above)
    onPrimary:            '#FFFFFF',
    onPrimaryContainer:   light.text,
    onSecondary:          '#FFFFFF',
    onSecondaryContainer: light.text,
    onTertiary:           '#FFFFFF',
    onTertiaryContainer:  light.text,
    onSurface:            light.text,
    onSurfaceVariant:     light.textMid,
    onBackground:         light.text,
    onError:              '#FFFFFF',
    onErrorContainer:     light.text,
    // Chrome
    outline:              light.border,
    outlineVariant:       light.midGrey,
    shadow:               light.shadow,
    scrim:                light.overlay,
    inverseSurface:       light.black,
    inverseOnSurface:     '#FFFFFF',
    inversePrimary:       light.accentLight,
    // Elevation tints (keep MD3 defaults)
    elevation:            DefaultTheme.colors.elevation,
  },
};

// ── Dark Paper theme (MD3) ──
export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    // Brand
    primary:              dark.primary,
    primaryContainer:     dark.primaryLight,
    secondary:            dark.secondary,
    secondaryContainer:   dark.secondaryLight,
    tertiary:             dark.accent,
    tertiaryContainer:    dark.accentLight,
    // Surfaces
    surface:              dark.card,
    surfaceVariant:       dark.cardAlt,
    background:           dark.background,
    // Semantic
    error:                dark.error,
    errorContainer:       dark.errorLight,
    // On-colours
    onPrimary:            dark.background,
    onPrimaryContainer:   dark.text,
    onSecondary:          dark.background,
    onSecondaryContainer: dark.text,
    onTertiary:           dark.background,
    onTertiaryContainer:  dark.text,
    onSurface:            dark.text,
    onSurfaceVariant:     dark.textMid,
    onBackground:         dark.text,
    onError:              dark.background,
    onErrorContainer:     dark.text,
    // Chrome
    outline:              dark.border,
    outlineVariant:       dark.midGrey,
    shadow:               dark.shadow,
    scrim:                dark.overlay,
    inverseSurface:       dark.text,
    inverseOnSurface:     dark.background,
    inversePrimary:       dark.accentLight,
    // Elevation surfaces for dark mode cards
    elevation: {
      level0: 'transparent',
      level1: dark.card,
      level2: dark.card,
      level3: dark.cardAlt,
      level4: dark.cardAlt,
      level5: dark.cardAlt,
    },
  },
};

// Default export stays backward compatible
export const theme = lightTheme;
export default theme;
