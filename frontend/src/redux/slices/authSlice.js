import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api/authAPI';
import { secureStorage } from '../../services/storage/secureStorage';
import { firebaseAuth } from '../../services/firebase/firebaseAuth';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(credentials);
    const { user, accessToken, refreshToken } = res.data.data;
    await secureStorage.setToken(accessToken);
    await secureStorage.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  }
  catch (err) {
    const data = err.response?.data;
    const message = data?.message || 'Login failed. Please try again.';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    console.log('[AUTH] Registering with:', JSON.stringify(data));
    const res = await authAPI.register(data);
    console.log('[AUTH] Registration success:', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.error('[AUTH] Registration error:', err?.message, err?.response?.status, JSON.stringify(err?.response?.data));
    return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp, mode }, { rejectWithValue }) => {
  try {
    const res = await authAPI.verifyOTP(email, otp, mode);
    const data = res.data?.data;
    // For registration flow, backend returns tokens for auto-login
    if (data?.accessToken) {
      await secureStorage.setToken(data.accessToken);
      if (data.refreshToken) await secureStorage.setRefreshToken(data.refreshToken);
      return { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authAPI.logout(); } catch (_) { /* ignore – clear tokens regardless */ }
  await secureStorage.removeToken();
  await secureStorage.removeRefreshToken();
});

export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (_, { rejectWithValue }) => {
  try {
    // Step 1: Firebase sign-in (web redirects, native returns result)
    const result = await firebaseAuth.signInWithGoogle();
    
    // If web platform, signInWithGoogle redirects - will return null
    // The redirect result will be handled by the login screen's useEffect
    if (result === null) {
      // Web redirect flow - just return, let useEffect handle redirect result
      return null;
    }
    
    // Step 2: Send to backend (native flow)
    const { token, profile } = result;
    const res = await authAPI.googleAuth(token, profile);
    const { user, accessToken, refreshToken } = res.data.data;
    await secureStorage.setToken(accessToken);
    await secureStorage.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Google sign-in failed';
    return rejectWithValue(message);
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { dispatch, rejectWithValue }) => {
  try {
    const token = await secureStorage.getToken();
    if (!token) return rejectWithValue('No token');
    
    // Try to validate token, but don't crash if backend is unreachable
    try {
      const res = await authAPI.getMe();
      return { user: res.data.data.user, accessToken: token };
    } catch (apiErr) {
      // If it's a network error, warn but don't block the app
      if (!apiErr.response) {
        console.warn('[AUTH] Backend unreachable during checkAuth, proceeding offline');
        // Return a minimal auth state so app can load
        return { user: null, accessToken: token };
      }
      // If it's an actual API error (401, 403, etc), clear auth
      throw apiErr;
    }
  } catch (err) {
    // If validation fails, ensure we clear local state
    await dispatch(logoutUser());
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isAuthenticated: false, loading: false, isAuthLoading: true, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => { state.isAuthLoading = true; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(googleSignIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(googleSignIn.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(googleSignIn.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
