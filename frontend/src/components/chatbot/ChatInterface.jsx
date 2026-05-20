import React, { useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = ({ messages = [], onSend, suggestions = [], loading = false }) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  
  const getMessageKey = useCallback((item, index) => {
    if (item._id) return `${item._id}`;
    if (item.id) return `${item.id}`;
    return `msg_${item.role || 'unknown'}_${item.timestamp || 0}_${index}`;
  }, []);
  
  const handleContentSizeChange = useCallback(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);
  
  return (
    <KeyboardAvoidingView
      style={[s.c, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
    >
      <FlatList 
        ref={listRef} 
        data={messages} 
        keyExtractor={getMessageKey}
        renderItem={({ item }) => <ChatMessage message={item} />}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={[s.list, messages.length === 0 && s.listEmpty]}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={(
          <View style={s.empty}>
            <View style={[s.emptyIconWrap, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '33' }]}>
              <Ionicons name="sparkles" size={28} color={colors.primary} />
            </View>
            <Text style={[s.emptyTitle, { color: colors.text }]}>Hi, I'm your AI Health Assistant</Text>
            <Text style={[s.emptySub, { color: colors.textTertiary }]}>
              Ask me anything about medications, fitness, nutrition, or your wellbeing.
            </Text>
          </View>
        )}
      />
      {suggestions.length > 0 && <ChatSuggestions suggestions={suggestions} onSelect={onSend} />}
      <ChatInput onSend={onSend} loading={loading} />
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  listEmpty: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingHorizontal: 32, maxWidth: 420 },
  emptyIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 1 },
  emptyTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center', marginBottom: 8 },
  emptySub: { fontSize: 14, lineHeight: 20, textAlign: 'center', fontWeight: '500' },
});

export default ChatInterface;
