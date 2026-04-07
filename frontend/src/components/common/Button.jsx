import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * HEALIO Button Component
 * Professional healthcare app button with gradient primary, variants, sizes, and states
 * 
 * Variants: primary | secondary | danger | outline | ghost
 * Sizes: small | medium | large
 * States: default | loading | disabled
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  ...props
}) => {
  const { colors, isDark } = useAppTheme();
  const styles = createStyles(colors, isDark);
  
  // Get variant styles
  const variantStyle = styles[variant];
  const sizeStyle = styles[`size_${size}`];
  
  // Get text color for this variant
  const getTextColor = () => {
    switch(variant) {
      case 'primary': return '#FFFFFF';
      case 'danger': return '#FFFFFF';
      case 'secondary': return colors.primary;
      case 'outline': return colors.primary;
      case 'ghost': return colors.text;
      default: return colors.text;
    }
  };

  const textColor = getTextColor();
  const isDisabled = disabled || loading;

  // Render button content
  const renderContent = () => (
    <View style={[styles.content, { flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse' }]}>
      {icon && !loading && (
        <Ionicons 
          name={icon} 
          size={size === 'small' ? 14 : size === 'large' ? 22 : 18} 
          color={textColor}
          style={[styles.icon, iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }]}
        />
      )}
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={textColor} 
          style={{ marginRight: iconPosition === 'left' ? 8 : 0, marginLeft: iconPosition === 'right' ? 8 : 0 }}
        />
      )}
      <Text style={[styles[`text_${size}`], { color: textColor }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );

  // Primary and danger buttons use gradient
  if ((variant === 'primary' || variant === 'danger') && !isDisabled) {
    const gradientColors = variant === 'primary' 
      ? [colors.primary, colors.primaryDark]
      : ['#F87171', '#EF4444'];

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[variantStyle, sizeStyle, style, isDisabled && styles.disabled]}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientContainer, sizeStyle]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Other variants (outline, secondary, ghost)
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        variantStyle,
        sizeStyle,
        style,
        isDisabled && styles.disabled
      ]}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  // ── Variants ──
  primary: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondary: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Sizes ──
  size_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  size_large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // ── Text Styles ──
  text_small: {
    fontSize: 13,
    fontWeight: '600',
  },
  text_medium: {
    fontSize: 15,
    fontWeight: '700',
  },
  text_large: {
    fontSize: 16,
    fontWeight: '700',
  },

  // ── States ──
  disabled: {
    opacity: 0.5,
  },

  // ── Content Layout ──
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  gradientContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

export default Button;
