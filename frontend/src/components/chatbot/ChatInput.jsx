import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const ChatInput = ({ onSend, loading = false, error = null }) => {
  const { colors } = useAppTheme();
  const [text, setText] = useState('');
  const debounceRef = useRef(null);
  
  // Debounced text update to reduce re-renders on every keystroke
  const handleTextChange = useCallback((value) => {
    setText(value);
  }, []);
  
  // Memoized send function to prevent recreation on each render
  const send = useCallback(() => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  }, [text, loading, onSend]);
  
  // Memoized button style to prevent recreation
  const buttonStyle = useMemo(() => [
    s.btn,
    { backgroundColor: colors.primary },
    (!text.trim() || loading) && { backgroundColor: colors.textTertiary }
  ], [text, loading, colors.primary, colors.textTertiary]);
  
  const isDisabled = loading || !text.trim();
  
  return (
    <View style={[s.c, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={[s.inputRow, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.textTertiary} style={s.inputIcon} />
        <TextInput
          style={[s.input, { color: colors.text, ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }) }]}
          placeholder="Ask a health question..."
          placeholderTextColor={colors.textTertiary}
          value={text}
          onChangeText={handleTextChange}
          maxLength={500}
          onSubmitEditing={send}
          returnKeyType="send"
          blurOnSubmit={false}
          editable={!loading}
        />
      </View>
      <TouchableOpacity 
        style={buttonStyle} 
        onPress={send} 
        disabled={isDisabled}
        activeOpacity={isDisabled ? 0.5 : 0.7}
      >
        {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={18} color="#FFF" />}
      </TouchableOpacity>
      {error && <Text style={[s.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};
const s = StyleSheet.create({
  c: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'center', gap: 8 },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 24, paddingHorizontal: 14, borderWidth: 1, height: 44 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, height: 44, lineHeight: 18 },
  btn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 12, marginTop: 4, paddingHorizontal: 10 },
});
export default ChatInput;
