import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * ThemeToggle – animated toggle switch for light/dark mode.
 *
 * Variants:
 *   'switch'  — pill-shaped toggle (default, for settings/header)
 *   'icon'    — compact icon button (for navigation bars)
 *   'full'    — three-option selector (light / system / dark)
 *
 * Usage:
 *   <ThemeToggle />
 *   <ThemeToggle variant="icon" size={22} />
 *   <ThemeToggle variant="full" />
 */
const ThemeToggle = ({ variant = 'switch', size = 22, style }) => {
  const { isDark, mode, toggleTheme, setScheme, colors } = useAppTheme();

  // ─── Animated pill position for 'switch' variant ───
  const slideAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [isDark]);

  // ─── Icon-only variant (compact) ───
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={toggleTheme}
        style={[s.iconBtn, { backgroundColor: colors.cardAlt }, style]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        accessibilityHint="Toggles between light and dark theme"
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={size}
          color={isDark ? '#FBBF24' : '#6366F1'}
        />
      </TouchableOpacity>
    );
  }

  // ─── Full three-option selector variant ───
  if (variant === 'full') {
    const options = [
      { key: 'light', icon: 'sunny', label: 'Light' },
      { key: 'system', icon: 'phone-portrait-outline', label: 'System' },
      { key: 'dark', icon: 'moon', label: 'Dark' },
    ];
    return (
      <View style={[s.fullWrap, { backgroundColor: colors.cardAlt }, style]}>
        {options.map((opt) => {
          const active = mode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setScheme(opt.key)}
              style={[
                s.fullOption,
                active && { backgroundColor: colors.card },
                active && Platform.select({
                  ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4 },
                  android: { elevation: 2 },
                }),
              ]}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${opt.label} theme`}
            >
              <Ionicons
                name={opt.icon}
                size={18}
                color={active ? colors.primary : colors.textTertiary}
              />
              <Text style={[
                s.fullLabel,
                { color: active ? colors.primary : colors.textTertiary },
                active && { fontWeight: '700' },
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ─── Default: Switch variant (animated pill toggle) ───
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      style={[s.track, { backgroundColor: isDark ? colors.cardAlt : colors.borderLight }, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Dark mode toggle"
    >
      {/* Sun icon (left) */}
      <View style={s.trackIcon}>
        <Ionicons name="sunny" size={14} color={isDark ? colors.textTertiary : '#F59E0B'} />
      </View>
      {/* Moon icon (right) */}
      <View style={[s.trackIcon, { right: 6 }]}>
        <Ionicons name="moon" size={14} color={isDark ? '#818CF8' : colors.textTertiary} />
      </View>
      {/* Sliding knob */}
      <Animated.View style={[
        s.knob,
        { backgroundColor: isDark ? colors.card : '#FFFFFF', transform: [{ translateX }] },
        Platform.select({
          ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3 },
          android: { elevation: 3 },
        }),
      ]}>
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={14}
          color={isDark ? '#818CF8' : '#F59E0B'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  // ─ Icon variant ─
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─ Switch variant ─
  track: {
    width: 64,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  trackIcon: {
    position: 'absolute',
    left: 6,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  knob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },

  // ─ Full variant ─
  fullWrap: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  fullOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  fullLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ThemeToggle;
