import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

const PRIMARY = '#4A90D9';

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  style,
  labelStyle,
  icon,
  ...rest
}) => {
  const mode =
    variant === 'outline'
      ? 'outlined'
      : variant === 'secondary'
      ? 'text'
      : 'contained';

  const buttonColor =
    variant === 'primary'
      ? PRIMARY
      : variant === 'outline'
      ? 'transparent'
      : 'transparent';

  const textColor =
    variant === 'primary' ? '#FFFFFF' : PRIMARY;

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      buttonColor={buttonColor}
      textColor={textColor}
      style={[
        styles.button,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      labelStyle={[styles.label, labelStyle]}
      {...rest}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 4,
    marginVertical: 6,
  },
  outline: {
    borderColor: PRIMARY,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Button;
