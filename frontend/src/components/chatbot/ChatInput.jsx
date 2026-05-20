import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const ChatInput = ({ onSend, loading = false }) => {
  const { colors } = useAppTheme();
  const [text, setText] = useState('');
  const canSend = !!text.trim() && !loading;
  const send = () => { if (text.trim()) { onSend(text.trim()); setText(''); } };
  const containerShadow = Platform.OS === 'web'
    ? { boxShadow: '0 -6px 20px rgba(15, 23, 42, 0.06)' }
    : { elevation: 8, shadowColor: '#0F172A', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12 };
  const sendShadow = canSend
    ? (Platform.OS === 'web'
      ? { boxShadow: `0 6px 16px ${colors.primary}55` }
      : { elevation: 4, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 })
    : {};
  return (
    <View style={[s.c, { backgroundColor: colors.card, borderTopColor: colors.border }, containerShadow]}>
      <View style={[s.inputRow, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Ionicons name="sparkles-outline" size={17} color={colors.primary} style={s.inputIcon} />
        <TextInput
          style={[s.input, { color: colors.text, ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }) }]}
          placeholder="Ask anything about your health..."
          placeholderTextColor={colors.textTertiary}
          value={text}
          onChangeText={setText}
          maxLength={500}
          onSubmitEditing={send}
          returnKeyType="send"
          blurOnSubmit={false}
        />
      </View>
      <TouchableOpacity
        style={[s.btn, { backgroundColor: canSend ? colors.primary : colors.border }, sendShadow]}
        onPress={send}
        disabled={!canSend}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="arrow-up" size={20} color={canSend ? '#FFF' : colors.textTertiary} />}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({
  c: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, alignItems: 'center', gap: 10 },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 26, paddingHorizontal: 16, borderWidth: 1, height: 48 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: 48, lineHeight: 20, fontWeight: '400', letterSpacing: 0.1 },
  btn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
export default ChatInput;
