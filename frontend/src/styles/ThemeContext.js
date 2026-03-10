import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useColorScheme, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from './colors';
import { lightTheme, darkTheme } from './theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME_STORAGE_KEY = '@healio_theme_mode';

// ── Context ──
const ThemeContext = createContext({
  isDark: false,
  mode: 'system',
  colors: light,
  paperTheme: lightTheme,
  toggleTheme: () => {},
  setScheme: () => {},
});

/**
 * HEALIO ThemeProvider
 * Wraps the app and provides color tokens + Paper theme for both modes.
 *
 * Supports three modes:
 *   'system' (default) — follows device setting
 *   'light'            — forced light
 *   'dark'             — forced dark
 *
 * Persists the user's preference to AsyncStorage so it survives app restarts.
 */
export const ThemeProvider = ({ children, initialMode = 'system' }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState(initialMode); // 'system' | 'light' | 'dark'
  const [loaded, setLoaded] = useState(false);

  // Load persisted theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setMode(saved);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  // Animate layout changes when theme switches
  const animateTransition = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(250, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
  }, []);

  // Toggle cycles: current → opposite (system resolves first then toggles)
  const toggleTheme = useCallback(() => {
    animateTransition();
    setMode((prev) => {
      const next = prev === 'system'
        ? (systemScheme === 'dark' ? 'light' : 'dark')
        : prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, [systemScheme, animateTransition]);

  // Set an explicit scheme ('system' | 'light' | 'dark') and persist it
  const setScheme = useCallback((s) => {
    animateTransition();
    setMode(s);
    AsyncStorage.setItem(THEME_STORAGE_KEY, s);
  }, [animateTransition]);

  const value = useMemo(
    () => ({
      isDark,
      mode,
      loaded,
      colors: isDark ? dark : light,
      paperTheme: isDark ? darkTheme : lightTheme,
      toggleTheme,
      setScheme,
    }),
    [isDark, mode, loaded, toggleTheme, setScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook – access HEALIO theme tokens anywhere:
 *
 *   const { colors, isDark, mode, toggleTheme, setScheme } = useAppTheme();
 */
export const useAppTheme = () => useContext(ThemeContext);

export default ThemeContext;
