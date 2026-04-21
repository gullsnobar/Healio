import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api/dashboardAPI';

export const fetchDashboardData = createAsyncThunk('user/fetchDashboard', async (date, { rejectWithValue }) => {
  try {
    const res = await dashboardAPI.getDashboardData(date);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard');
  }
});

export const fetchHealthScore = createAsyncThunk('user/fetchHealthScore', async (_, { rejectWithValue }) => {
  try {
    const res = await dashboardAPI.getHealthScore();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch health score');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, dashboardData: null, healthScore: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => { state.loading = false; state.dashboardData = action.payload; })
      .addCase(fetchDashboardData.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchHealthScore.fulfilled, (state, action) => { state.healthScore = action.payload; });
  },
});

export default userSlice.reducer;
