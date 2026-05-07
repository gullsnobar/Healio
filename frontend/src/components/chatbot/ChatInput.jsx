import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const ChatInput = ({ onSend, loading = false }) => {
  const { colors } = useAppTheme();
  const [text, setText] = useState('');
  const canSend = !!text.trim() && !loading;
  const send = () => { if (text.trim()) { onSend(text.trim()); setText(''); } };
  return (
    <View style={[s.c, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={[s.inputRow, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.textTertiary} style={s.inputIcon} />
        <TextInput
          style={[s.input, { color: colors.text, ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }) }]}
          placeholder="Ask a health question..."
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
        style={[s.btn, { backgroundColor: canSend ? colors.primary : colors.border }]}
        onPress={send}
        disabled={!canSend}
      >
        {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={18} color={canSend ? '#FFF' : colors.textTertiary} />}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({
  c: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'center', gap: 8 },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 24, paddingHorizontal: 14, borderWidth: 1, height: 44 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, height: 44, lineHeight: 18 },
  btn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
export default ChatInput;
