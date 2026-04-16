import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api/chatbotAPI';

// Abort controller for request cancellation
let sendMessageAbortController = null;

export const sendMessage = createAsyncThunk(
  'chatbot/send',
  async ({ message, sessionId, context }, { rejectWithValue, signal }) => {
    try {
      // Cancel previous request if pending
      if (sendMessageAbortController) {
        sendMessageAbortController.abort();
      }
      
      // Create new abort controller for this request
      sendMessageAbortController = new AbortController();
      
      const res = await chatbotAPI.sendMessage(message, sessionId, context, {
        signal: sendMessageAbortController.signal
      });
      
      const { sessionId: newSessionId, response } = res.data;
      const botMessage = {
        role: 'assistant',
        content: response,
        _id: Date.now().toString(),
        sessionId: newSessionId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const userMessage = {
        role: 'user',
        content: message,
        _id: (Date.now() - 1).toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      return {
        userMessage,
        botMessage,
        sessionId: newSessionId
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send message'
      );
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
    } catch (error) {
      console.warn('Failed to fetch suggestions:', error);
      // Don't reject - suggestions are optional
      return [];
    }
  }
);

const initialState = {
  messages: [],
  suggestions: [],
  loading: false,
  error: null,
  sessionId: null,
  lastMessageAt: null,
  messageCount: 0
};

const slice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.error = null;
      state.lastMessageAt = null;
      state.messageCount = 0;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // sendMessage handlers
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload.userMessage);
        state.messages.push(action.payload.botMessage);
        state.sessionId = action.payload.sessionId;
        state.lastMessageAt = Date.now();
        state.messageCount++;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchSuggestions handlers
    builder
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.suggestions = [];
      });
  }
});

export const { clearChat, setSessionId, clearError } = slice.actions;
export default slice.reducer;
