import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, fetchSuggestions, clearChat } from '../redux/slices/chatbotSlice';

export const useChatbot = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.chatbot);
  return { 
    ...state, 
    send: (message, sessionId, context = 'general') => dispatch(sendMessage({ message, sessionId, context })), 
    getSuggestions: (healthData) => dispatch(fetchSuggestions(healthData)), 
    clear: () => dispatch(clearChat()) 
  };
};
