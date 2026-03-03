import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0F766E';

const DeleteConfirmDialog = ({
  visible = false,
  title = 'Delete Item',
  message = 'This action cannot be undone. Are you sure?',
  itemName = '',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={s.overlay}>
      <View style={s.card}>
        {/* Warning icon */}
        <View style={s.iconCircle}>
          <Ionicons name="trash-outline" size={28} color="#EF4444" />
        </View>

        <Text style={s.title}>{title}</Text>

        {!!itemName && <Text style={s.itemName}>{itemName}</Text>}

        <Text style={s.message}>{message}</Text>

        {/* Action buttons */}
        <View style={s.actions}>
          <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
            <Text style={s.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.deleteBtn} onPress={onConfirm} activeOpacity={0.85}>
            <Ionicons name="trash" size={16} color="#FFF" />
            <Text style={s.deleteText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default DeleteConfirmDialog;
