import { useSelector, useDispatch } from 'react-redux';
import { fetchFitnessData, logWaterIntake, logDiet, logManualEntry } from '../redux/slices/fitnessSlice';

export const useFitness = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.fitness);
  return { ...state, fetch: () => dispatch(fetchFitnessData()), logWater: (ml) => dispatch(logWaterIntake(ml)), logMeal: (d) => dispatch(logDiet(d)), logManual: (d) => dispatch(logManualEntry(d)) };
};
