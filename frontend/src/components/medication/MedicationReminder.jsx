import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, RoundedRect, Circle, Ellipse } from 'react-native-svg';

const PRIMARY = '#0F766E';

/* Simple pill capsule illustration */
const PillIllustration = () => (
  <Svg width={80} height={80} viewBox="0 0 80 80">
    <Circle cx={40} cy={40} r={36} fill="#FEF3C7" />
    <Rect x={24} y={32} width={32} height={16} rx={8} fill="#F59E0B" />
    <Rect x={40} y={32} width={16} height={16} rx={0} fill="#FBBF24" />
    <Ellipse cx={40} cy={40} rx={3} ry={8} fill="rgba(255,255,255,0.3)" />
  </Svg>
);

const MedicationReminder = ({ reminder, onTake, onEdit, onSnooze, onDismiss, visible = true }) => {
  const { medicationName, dosage, timing, scheduledTime, amount } = reminder || {};

  const now = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => onDismiss?.(reminder)}>
      <View style={s.overlay}>
        <View style={s.card}>
          {/* Dismiss */}
          <TouchableOpacity style={s.dismissBtn} onPress={() => onDismiss?.(reminder)}>
            <Ionicons name="close" size={22} color="#94A3B8" />
          </TouchableOpacity>

          {/* Pill illustration */}
          <PillIllustration />

          {/* Question */}
          <Text style={s.question}>Did you take your Medicine?</Text>

          {/* Med info */}
          <Text style={s.medName}>{medicationName || 'Medicine'}</Text>

          <View style={s.infoRow}>
            <View style={s.infoBadge}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={s.infoText}>Scheduled for {scheduledTime || timing || '--:--'}, {dayName}</Text>
            </View>
          </View>

          {(dosage || amount) && (
            <View style={s.infoBadge}>
              <Ionicons name="medical-outline" size={14} color="#64748B" />
              <Text style={s.infoText}>{amount ? `${amount}, ` : ''}{dosage || ''}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity
              style={s.takeBtn}
              onPress={() => onTake?.(reminder)}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark" size={20} color="#FFF" />
              <Text style={s.takeBtnText}>Take</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.editBtn}
              onPress={() => (onEdit || onSnooze)?.(reminder)}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={20} color={PRIMARY} />
              <Text style={s.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  dismissBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 4,
  },
  medName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoRow: { marginBottom: 6 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 20,
  },
  takeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  takeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF9',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
  },
  editBtnText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MedicationReminder;
