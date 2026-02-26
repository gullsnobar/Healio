import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

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
  const [secureVisible, setSecureVisible] = useState(!secureTextEntry);

  const renderLeftIcon = leftIcon
    ? (props) => (
        <TextInput.Icon
          icon={() => (
            <Ionicons name={leftIcon} size={20} color={PRIMARY} />
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
              color={PRIMARY}
            />
          )}
          onPress={() => setSecureVisible((prev) => !prev)}
        />
      )
    : rightIcon
    ? (props) => (
        <TextInput.Icon
          icon={() => (
            <Ionicons name={rightIcon} size={20} color={PRIMARY} />
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
        outlineColor="#CCC"
        activeOutlineColor={PRIMARY}
        style={[styles.input, inputStyle]}
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
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  error: {
    paddingHorizontal: 0,
  },
});

export default Input;
