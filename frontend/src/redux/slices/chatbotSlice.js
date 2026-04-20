import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api/chatbotAPI';

export const sendMessage = createAsyncThunk(
  'chatbot/send',
  async ({ message, sessionId, context }, { rejectWithValue }) => {
    try {
      const res = await chatbotAPI.sendMessage(message, sessionId, context);
      const payload = res.data?.data || {};
      const { sessionId: newSessionId, response } = payload;

      const baseId = Date.now().toString();

      const userMessage = {
        role: 'user',
        content: message,
        _id: `${baseId}_user`,
        timestamp: Date.now(),
      };

      const botMessage = {
        role: 'assistant',
        content: response || 'I am having trouble responding right now. Please try again later.',
        _id: `${baseId}_bot`,
        timestamp: Date.now() + 1,
        sessionId: newSessionId,
      };

      return {
        userMessage,
        botMessage,
        sessionId: newSessionId || sessionId || null,
      };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to send message';
      return rejectWithValue(msg);
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'chatbot/suggestions',
  async (healthData, { rejectWithValue }) => {
    try {
      const res = await chatbotAPI.getSuggestions(
        healthData || { steps: 0, sleepHours: 0, missedDoses: 0, waterIntake: 0 }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load suggestions');
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  'chatbot/loadHistory',
  async (_, { rejectWithValue }) => {
    try {
      const sessionsRes = await chatbotAPI.getHistory();
      const sessions = sessionsRes.data?.data || [];
      if (!sessions.length) {
        return { sessionId: null, messages: [] };
      }
      const latest = sessions[0];
      const historyRes = await chatbotAPI.getSessionHistory(latest.sessionId);
      const chat = historyRes.data?.data;
      if (!chat) {
        return { sessionId: null, messages: [] };
      }
      const messages = (chat.messages || []).map((m, idx) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        _id: `${chat.sessionId}_${idx}_${m.role}`,
      }));
      return { sessionId: chat.sessionId, messages };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load chat history');
    }
  }
);

const slice = createSlice({
  name: 'chatbot',
  initialState: { messages: [], suggestions: [], loading: false, sessionId: null, error: null },
  reducers: { 
    clearChat: (s) => { s.messages = []; s.sessionId = null; s.error = null; },
    setSessionId: (s, a) => { s.sessionId = a.payload; },
  },
  extraReducers: (b) => {
    b
      .addCase(sendMessage.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(sendMessage.fulfilled, (s, a) => { 
        s.loading = false; 
        s.messages.push(a.payload.userMessage, a.payload.botMessage); 
        s.sessionId = a.payload.sessionId;
      })
      .addCase(sendMessage.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })
      .addCase(fetchSuggestions.fulfilled, (s, a) => { s.suggestions = a.payload; })
      .addCase(loadChatHistory.fulfilled, (s, a) => { s.messages = a.payload.messages; s.sessionId = a.payload.sessionId; });
  },
});

export const { clearChat, setSessionId } = slice.actions;
export default slice.reducer;
