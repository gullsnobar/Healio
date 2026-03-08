import api from './axiosInstance';

export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot', { message }),
  getHistory: () => api.get('/chatbot/history'),
  getSuggestions: () => api.get('/chatbot/suggestions'),
  clearHistory: () => api.delete('/chatbot/history'),
};
