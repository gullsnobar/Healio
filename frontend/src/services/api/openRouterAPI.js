import api from './axiosInstance';

export const openRouterAPI = {
  sendMessage: (message, model = 'meta-llama/llama-3-8b-instruct') =>
    api.post('/chat', { message, model }),
  getAvailableModels: () =>
    api.get('/chat/models'),
};
