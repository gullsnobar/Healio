import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api/chatbotAPI';

export const sendMessage = createAsyncThunk('chatbot/send', async ({ message, sessionId, context }) => {
  const res = await chatbotAPI.sendMessage(message, sessionId, context);
  // Backend returns: { success: true, data: { sessionId, response } }
  const { sessionId: newSessionId, response } = res.data;
  const botMessage = { 
    role: 'assistant', 
    content: response, 
    _id: Date.now().toString(),
    sessionId: newSessionId 
  };
  return { 
    userMessage: { role: 'user', content: message, _id: Date.now().toString() }, 
    botMessage,
    sessionId: newSessionId 
  };
});

export const fetchSuggestions = createAsyncThunk('chatbot/suggestions', async (healthData) => {
  const res = await chatbotAPI.getSuggestions(healthData || { steps: 0, sleepHours: 0, missedDoses: 0, waterIntake: 0 });
  return res.data;
});

const slice = createSlice({
  name: 'chatbot',
  initialState: { messages: [], suggestions: [], loading: false, sessionId: null },
  reducers: { 
    clearChat: (s) => { s.messages = []; },
    setSessionId: (s, a) => { s.sessionId = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(sendMessage.pending, (s) => { s.loading = true; })
      .addCase(sendMessage.fulfilled, (s, a) => { 
        s.loading = false; 
        s.messages.push(a.payload.userMessage, a.payload.botMessage); 
        s.sessionId = a.payload.sessionId;
      })
      .addCase(fetchSuggestions.fulfilled, (s, a) => { s.suggestions = a.payload; });
  },
});
export const { clearChat, setSessionId } = slice.actions;
export default slice.reducer;
