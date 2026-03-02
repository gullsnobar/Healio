import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api/authAPI';
import { secureStorage } from '../../services/storage/secureStorage';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(credentials);
    const { user, accessToken, refreshToken } = res.data.data;
    await secureStorage.setToken(accessToken);
    return { user, accessToken, refreshToken };
  }
  catch (err) {
    const data = err.response?.data;
    const message = data?.message || 'Login failed. Please try again.';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await authAPI.register(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp, mode }, { rejectWithValue }) => {
  try {
    const res = await authAPI.verifyOTP(email, otp, mode);
    const data = res.data?.data;
    // For registration flow, backend returns tokens for auto-login
    if (data?.accessToken) {
      await secureStorage.setToken(data.accessToken);
      return { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
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
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.error = null; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Auto-login if tokens were returned (registration flow)
        if (action.payload?.accessToken) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
