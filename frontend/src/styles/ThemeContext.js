import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { light, dark } from './colors';
import { lightTheme, darkTheme } from './theme';

// ── Context ──
const ThemeContext = createContext({
  isDark: false,
  colors: light,
  paperTheme: lightTheme,
  toggleTheme: () => {},
  setScheme: () => {},
});

/**
 * VitalSync ThemeProvider
 * Wraps the app and provides color tokens + Paper theme for both modes.
 *
 * Supports three modes via `initialMode`:
 *   'system' (default) — follows device setting
 *   'light'            — forced light
 *   'dark'             — forced dark
 */
export const ThemeProvider = ({ children, initialMode = 'system' }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState(initialMode); // 'system' | 'light' | 'dark'

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'system') return isDark ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [isDark]);

  const setScheme = useCallback((s) => setMode(s), []);

  const value = useMemo(
    () => ({
      isDark,
      mode,
      colors: isDark ? dark : light,
      paperTheme: isDark ? darkTheme : lightTheme,
      toggleTheme,
      setScheme,
    }),
    [isDark, mode, toggleTheme, setScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook – access VitalSync theme tokens anywhere:
 *
 *   const { colors, isDark, toggleTheme } = useAppTheme();
 */
export const useAppTheme = () => useContext(ThemeContext);

export default ThemeContext;
