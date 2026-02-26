import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api/chatbotAPI';

export const sendMessage = createAsyncThunk('chatbot/send', async (message) => {
  const res = await chatbotAPI.sendMessage(message);
  return { userMessage: { role: 'user', content: message, _id: Date.now().toString() }, botMessage: res.data };
});
export const fetchSuggestions = createAsyncThunk('chatbot/suggestions', async () => (await chatbotAPI.getSuggestions()).data);

const slice = createSlice({
  name: 'chatbot',
  initialState: { messages: [], suggestions: [], loading: false },
  reducers: { clearChat: (s) => { s.messages = []; } },
  extraReducers: (b) => {
    b.addCase(sendMessage.pending, (s) => { s.loading = true; })
     .addCase(sendMessage.fulfilled, (s, a) => { s.loading = false; s.messages.push(a.payload.userMessage, a.payload.botMessage); })
     .addCase(fetchSuggestions.fulfilled, (s, a) => { s.suggestions = a.payload; });
  },
});
export const { clearChat } = slice.actions;
export default slice.reducer;
