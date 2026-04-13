import api from './axiosInstance';

export const chatbotAPI = {
  sendMessage: (message, sessionId, context) => api.post('/chatbot/message', { message, sessionId, context }),
  getHistory: () => api.get('/chatbot/history'),
  getSessionHistory: (sessionId) => api.get(`/chatbot/history/${sessionId}`),
  getSuggestions: (healthData) => api.post('/ai/suggestions', healthData),
  clearHistory: (sessionId) => api.delete(`/chatbot/history/${sessionId}`),
};
