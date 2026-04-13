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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    minWidth: 280,
    borderRadius: 18,
    padding: 18,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
    maxHeight: '65%',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btn: {
    minHeight: 48,
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
