import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openRouterAPI } from '../../services/api/openRouterAPI';

export const sendSimpleMessage = createAsyncThunk('simpleChat/send', async (message) => {
  try {
    const res = await openRouterAPI.sendMessage(message);
    const botMessage = { 
      role: 'bot', 
      text: res.data?.reply || 'No response from AI', 
      timestamp: new Date().toISOString()
    };
    return { 
      userMessage: { role: 'user', text: message, timestamp: new Date().toISOString() },
      botMessage
    };
  } catch (error) {
    throw error.response?.data?.error || 'Failed to send message';
  }
});

const slice = createSlice({
  name: 'simpleChat',
  initialState: { messages: [], loading: false, error: null },
  reducers: { 
    clearChat: (s) => { s.messages = []; s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(sendSimpleMessage.pending, (s) => { 
      s.loading = true;
      s.error = null;
    })
      .addCase(sendSimpleMessage.fulfilled, (s, a) => { 
        s.loading = false; 
        s.messages.push(a.payload.userMessage, a.payload.botMessage); 
      })
      .addCase(sendSimpleMessage.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { clearChat } = slice.actions;
export default slice.reducer;
