import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  return {
    ...auth,
    login: (credentials) => dispatch(loginUser(credentials)),
    register: (data) => dispatch(registerUser(data)),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
  };
};
