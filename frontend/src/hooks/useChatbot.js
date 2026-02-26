import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, fetchSuggestions, clearChat } from '../redux/slices/chatbotSlice';

export const useChatbot = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.chatbot);
  return { ...state, send: (msg) => dispatch(sendMessage(msg)), getSuggestions: () => dispatch(fetchSuggestions()), clear: () => dispatch(clearChat()) };
};
