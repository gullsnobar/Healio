import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot', { message }),
  getHistory: () => api.get('/chatbot/history'),
  getSuggestions: () => api.get('/chatbot/suggestions'),
  clearHistory: () => api.delete('/chatbot/history'),
};
