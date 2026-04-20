import React, { useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
      style={[s.c, { backgroundColor: colors.background, paddingBottom: insets.bottom }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 56 : 0}
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
