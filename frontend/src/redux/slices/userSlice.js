import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDashboardData = createAsyncThunk('user/fetchDashboard', async () => {
  // Fetch dashboard data from API
  return {};
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, dashboardData: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => { state.loading = false; state.dashboardData = action.payload; })
      .addCase(fetchDashboardData.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default userSlice.reducer;
