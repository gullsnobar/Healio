import { useSelector, useDispatch } from 'react-redux';
import { fetchMedications, addMedication, updateMedication, deleteMedication } from '../redux/slices/medicationSlice';

export const useMedication = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.medication);
  return { ...state, fetch: () => dispatch(fetchMedications()), add: (d) => dispatch(addMedication(d)), update: (id, d) => dispatch(updateMedication({ id, data: d })), remove: (id) => dispatch(deleteMedication(id)) };
};
