import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const ChatInput = ({ onSend, loading = false }) => {
  const { colors } = useAppTheme();
  const [text, setText] = useState('');
  const send = () => { if (text.trim()) { onSend(text.trim()); setText(''); } };
  return (
    <View style={[s.c, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={[s.inputRow, { backgroundColor: colors.cardAlt }]}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textTertiary} style={s.inputIcon} />
        <TextInput style={[s.input, { color: colors.text }]} placeholder="Ask a health question..." placeholderTextColor={colors.textTertiary} value={text} onChangeText={setText} multiline maxLength={500} />
      </View>
      <TouchableOpacity style={[s.btn, { backgroundColor: colors.primary }, (!text.trim() && !loading) && { backgroundColor: colors.textTertiary }]} onPress={send} disabled={loading || !text.trim()}>
        {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={20} color="#FFF" />}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({
  c: { flexDirection: 'row', padding: 8, borderTopWidth: 1, alignItems: 'flex-end' },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  btn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
export default ChatInput;
