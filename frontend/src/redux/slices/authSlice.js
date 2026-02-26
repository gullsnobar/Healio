import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api/authAPI';
import { secureStorage } from '../../services/storage/secureStorage';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try { const res = await authAPI.login(credentials); await secureStorage.setToken(res.data.token); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await authAPI.register(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout(); await secureStorage.removeToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isAuthenticated: false, loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
