import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../styles/colors';
import { useAppTheme } from '../../styles/ThemeContext';

const Modal = ({
  visible = false,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = true,
  animationType = 'fade',
}) => {
  const { colors: themeColors } = useAppTheme();
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.backdrop}>
          <View style={[styles.container, { backgroundColor: themeColors.card }]}>
            {!!title && <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>}

            <View style={styles.content}>{children}</View>

            <View style={styles.actions}>
              {showCancel && onCancel && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={[styles.btn, styles.cancelBtn, { backgroundColor: themeColors.cardAlt }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelText, { color: themeColors.textSecondary }]}>{cancelText}</Text>
                </TouchableOpacity>
              )}
              {onConfirm && (
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[styles.btn, styles.confirmBtn, { backgroundColor: themeColors.primary }]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    borderRadius: 14,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  cancelBtn: {
  },
  confirmBtn: {
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Modal;
