import React, { memo, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = memo(({ messages = [], onSend, suggestions = [], loading = false, error = null }) => {
  const { colors } = useAppTheme();
  const listRef = useRef(null);

  // Memoized key extractor for FlatList to ensure stable keys
  const getMessageKey = useCallback((item, index) => {
    if (item._id) return item._id;
    const timestamp = item.timestamp || '';
    return `${item.role}-${timestamp}-${index}`;
  }, []);

  // Callback for scrolling to end
  const handleContentSizeChange = useCallback(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: false });
    }
  }, [messages.length]);

  // Memoize container style
  const containerStyle = useMemo(() => [
    s.container,
    { backgroundColor: colors.background }
  ], [colors.background]);

  // Render function for messages (already optimized by FlatList)
  const renderMessage = useCallback(
    ({ item }) => <ChatMessage message={item} />,
    []
  );

  return (
    <KeyboardAvoidingView
      style={containerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={getMessageKey}
        renderItem={renderMessage}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={s.list}
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
      />
      {suggestions.length > 0 && (
        <ChatSuggestions suggestions={suggestions} onSelect={onSend} />
      )}
      <ChatInput onSend={onSend} loading={loading} error={error} />
    </KeyboardAvoidingView>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if these props change
  return (
    prevProps.messages === nextProps.messages &&
    prevProps.suggestions === nextProps.suggestions &&
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.onSend === nextProps.onSend
  );
});

ChatInterface.displayName = 'ChatInterface';

const s = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 8 }
});

export default ChatInterface;
