import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiInsightsAPI } from '../../services/api/aiInsightsAPI';

// ── Thunks ──
export const fetchAIHealthInsights = createAsyncThunk(
  'aiInsights/fetchAll',
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getHealthInsights(days);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch AI insights');
    }
  },
);

export const fetchDailySummary = createAsyncThunk(
  'aiInsights/dailySummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getDailySummary();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch daily summary');
    }
  },
);

export const fetchWeeklyFeedback = createAsyncThunk(
  'aiInsights/weeklyFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getWeeklyFeedback();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch weekly feedback');
    }
  },
);

// ── Slice ──
const aiInsightsSlice = createSlice({
  name: 'aiInsights',
  initialState: {
    recommendations: [],
    dailySummary: null,
    weeklyFeedback: [],
    aggregatedData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAIInsights: (state) => {
      state.recommendations = [];
      state.dailySummary = null;
      state.weeklyFeedback = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Full insights
      .addCase(fetchAIHealthInsights.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAIHealthInsights.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.recommendations = payload.recommendations ?? [];
        state.dailySummary = payload.dailySummary ?? null;
        state.weeklyFeedback = payload.weeklyFeedback ?? [];
        state.aggregatedData = payload.aggregatedData ?? null;
      })
      .addCase(fetchAIHealthInsights.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Daily summary only
      .addCase(fetchDailySummary.fulfilled, (state, action) => { state.dailySummary = action.payload ?? null; })
      // Weekly feedback only
      .addCase(fetchWeeklyFeedback.fulfilled, (state, action) => { state.weeklyFeedback = (action.payload?.weeklyFeedback) ?? []; });
  },
});

export const { clearAIInsights } = aiInsightsSlice.actions;
export default aiInsightsSlice.reducer;
