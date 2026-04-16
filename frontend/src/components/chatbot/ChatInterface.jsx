import React, { useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = ({ messages = [], onSend, suggestions = [], loading = false }) => {
  const { colors } = useAppTheme();
  const listRef = useRef(null);
  
  // Stable key extractor for FlatList - generates unique, non-duplicate keys
  const getMessageKey = useCallback((item, index) => {
    // Priority: _id > id > generate stable key from timestamp + index + role
    if (item._id) return `${item._id}`;
    if (item.id) return `${item.id}`;
    // Fallback: stable key combining timestamp, role, and position
    return `msg_${item.role || 'unknown'}_${item.timestamp || 0}_${index}`;
  }, []);
  
  // Optimize scrolling to end
  const handleContentSizeChange = useCallback(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);
  
  return (
    <KeyboardAvoidingView 
      style={[s.c, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList 
        ref={listRef} 
        data={messages} 
        keyExtractor={getMessageKey}
        renderItem={({ item }) => <ChatMessage message={item} />}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={s.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
      {suggestions.length > 0 && <ChatSuggestions suggestions={suggestions} onSelect={onSend} />}
      <ChatInput onSend={onSend} loading={loading} />
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  list: { padding: 16, paddingBottom: 8 }
});

export default ChatInterface;
