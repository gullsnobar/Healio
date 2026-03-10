import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  error,
  errorMessage,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  style,
  inputStyle,
  ...rest
}) => {
  const { colors: themeColors } = useAppTheme();
  const [secureVisible, setSecureVisible] = useState(!secureTextEntry);

  const renderLeftIcon = leftIcon
    ? (props) => (
        <TextInput.Icon
          icon={() => (
            <Ionicons name={leftIcon} size={20} color={themeColors.primary} />
          )}
        />
      )
    : undefined;

  const renderRightIcon = secureTextEntry
    ? (props) => (
        <TextInput.Icon
          icon={() => (
            <Ionicons
              name={secureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={themeColors.primary}
            />
          )}
          onPress={() => setSecureVisible((prev) => !prev)}
        />
      )
    : rightIcon
    ? (props) => (
        <TextInput.Icon
          icon={() => (
            <Ionicons name={rightIcon} size={20} color={themeColors.primary} />
          )}
        />
      )
    : undefined;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        error={!!error}
        secureTextEntry={secureTextEntry && !secureVisible}
        left={renderLeftIcon ? renderLeftIcon() : undefined}
        right={renderRightIcon ? renderRightIcon() : undefined}
        outlineColor={themeColors.border}
        activeOutlineColor={themeColors.primary}
        style={[styles.input, { backgroundColor: themeColors.card }, inputStyle]}
        {...rest}
      />
      {!!error && !!errorMessage && (
        <HelperText type="error" visible={!!error} style={styles.error}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  input: {
    fontSize: 15,
  },
  error: {
    paddingHorizontal: 0,
  },
});

export default Input;
