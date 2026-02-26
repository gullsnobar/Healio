import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendations } from '../redux/slices/recommendationSlice';

export const useRecommendations = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.recommendation);
  return { ...state, fetch: () => dispatch(fetchRecommendations()) };
};
