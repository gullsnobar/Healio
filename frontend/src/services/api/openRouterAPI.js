import api from './axiosInstance';

export const openRouterAPI = {
  // Simple chat endpoint - calls backend /chat endpoint
  // Optional model parameter allows switching between models
  sendMessage: (message, model = "meta-llama/llama-3-8b-instruct") => 
    api.post('/chat', { message, model }),
  
  // Get list of available models
  getAvailableModels: () => 
    api.get('/chat/models'),
};
