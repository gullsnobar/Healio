import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, addAppointment, updateAppointment, deleteAppointment } from '../redux/slices/appointmentSlice';

export const useAppointment = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.appointment);
  return { ...state, fetch: () => dispatch(fetchAppointments()), add: (d) => dispatch(addAppointment(d)), update: (id, d) => dispatch(updateAppointment({ id, data: d })), remove: (id) => dispatch(deleteAppointment(id)) };
};
