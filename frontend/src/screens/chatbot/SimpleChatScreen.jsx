import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const SimpleChatScreen = () => {
  const { colors } = useAppTheme();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // ✅ Generate truly unique, stable message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // ✅ Send Message to OpenRouter via Backend
  const sendMessage = useCallback(async () => {
    try {
      if (!userInput.trim()) return;

      const userMessage = userInput.trim();
      setUserInput('');
      setLoading(true);

      // Generate unique message pair ID
      const messageGroupId = generateMessageId();

      // ✅ Call backend /chat endpoint
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // ✅ Prevent crash (use optional chaining)
      const botReply = data?.reply || 'No response from AI';
      const now = Date.now();

      // ✅ Add messages to state with unique, stable IDs
      setMessages((prev) => [
        ...prev,
        { 
          id: `${messageGroupId}_user`, 
          role: 'user', 
          text: userMessage, 
          timestamp: now,
          _id: `${messageGroupId}_user` 
        },
        { 
          id: `${messageGroupId}_bot`, 
          role: 'bot', 
          text: botReply, 
          timestamp: now + 1,
          _id: `${messageGroupId}_bot` 
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Chat Error:', error);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          _id: `error_${Date.now()}`,
          role: 'bot',
          text: 'Error: Could not connect to chatbot. Make sure backend is running on port 5000.',
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    }
  }, [userInput, generateMessageId]);

  // ✅ Optimized send handler
  const handleSendMessage = useCallback(() => {
    if (userInput.trim() && !loading) {
      sendMessage();
    }
  }, [userInput, loading, sendMessage]);

  // ✅ Optimized key extractor - guaranteed unique keys
  const getMessageKey = useCallback((item) => {
    return item.id || item._id || `msg_${item.timestamp}_${item.role}`;
  }, []);

  // ✅ Optimized scroll handler
  const handleContentSizeChange = useCallback(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages.length]);

  // ✅ Render message item for FlatList
  const renderMessageItem = ({ item }) => (
    <View
      style={[
        s.messageRow,
        item.role === 'user' ? s.userMessageRow : s.botMessageRow,
      ]}
    >
      <View
        style={[
          s.messageBubble,
          item.role === 'user'
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            s.messageText,
            {
              color: item.role === 'user' ? '#FFF' : colors.text,
            },
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  // ✅ Render loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={s.loadingRow}>
        <View style={[s.messageBubble, { backgroundColor: colors.cardAlt, flexDirection: 'row', gap: 8 }]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[s.messageText, { color: colors.textTertiary }]}>Thinking...</Text>
        </View>
      </View>
    );
  };

  // ✅ Render empty state
  const renderEmptyState = () => (
    <View style={s.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.textTertiary} />
      <Text style={[s.emptyText, { color: colors.textTertiary }]}>
        Start chatting with AI!
      </Text>
      <Text style={[s.emptySubtext, { color: colors.textTertiary }]}>
        Ask any health-related question
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[s.header, { backgroundColor: colors.primary }]}>
        <Text style={[s.headerTitle, { color: '#FFF' }]}>💬 AI Chatbot</Text>
        <Text style={[s.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>Powered by OpenRouter</Text>
      </View>

      {/* Messages List - Optimized FlatList */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={getMessageKey}
        renderItem={renderMessageItem}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={[
          s.messagesContent,
          messages.length === 0 && s.emptyContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        scrollEventThrottle={16}
      />

      {/* Input Area */}
      <View style={[s.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View
          style={[s.inputRow, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        >
          <Ionicons name="help-circle-outline" size={18} color={colors.textTertiary} style={s.inputIcon} />
          <TextInput
            style={[s.input, { color: colors.text }]}
            placeholder="Ask a health question..."
            placeholderTextColor={colors.textTertiary}
            value={userInput}
            onChangeText={setUserInput}
            maxLength={500}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
            editable={!loading}
          />
        </View>
        <TouchableOpacity
          style={[
            s.sendBtn,
            {
              backgroundColor: colors.primary,
              opacity: (loading || !userInput.trim()) ? 0.5 : 1,
            },
          ]}
          onPress={handleSendMessage}
          disabled={loading || !userInput.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Ionicons name="send" size={18} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 8,
  },
  messageRow: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingRow: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8,
    alignItems: 'center',
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: 44,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SimpleChatScreen;
