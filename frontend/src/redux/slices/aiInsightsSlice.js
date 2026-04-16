import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiInsightsAPI } from '../../services/api/aiInsightsAPI';

/**
 * Default/fallback structure for dailySummary to prevent null reference errors.
 * This ensures all code accessing dailySummary properties won't crash.
 */
const DEFAULT_DAILY_SUMMARY = {
  date: new Date().toISOString().slice(0, 10),
  steps: { value: 0, goal: 10000, status: 'needs_improvement' },
  calories: { consumed: 0, burned: 0, goal: 2000 },
  water: { value: 0, goal: 2500, status: 'needs_improvement' },
  sleep: { value: 0, goal: 8, status: 'needs_improvement' },
  medication: { taken: 0, missed: 0, total: 0, adherence: 0 },
  overallScore: 0,
};

// ── Thunks ──
export const fetchAIHealthInsights = createAsyncThunk(
  'aiInsights/fetchAll',
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getHealthInsights(days);
      // Validate response structure
      const payload = res.data?.data;
      if (!payload) {
        return rejectWithValue('Invalid API response: missing data');
      }
      // Ensure dailySummary has all required fields
      return {
        recommendations: Array.isArray(payload.recommendations) ? payload.recommendations : [],
        dailySummary: payload.dailySummary && typeof payload.dailySummary === 'object' 
          ? { ...DEFAULT_DAILY_SUMMARY, ...payload.dailySummary }
          : DEFAULT_DAILY_SUMMARY,
        weeklyFeedback: Array.isArray(payload.weeklyFeedback) ? payload.weeklyFeedback : [],
        aggregatedData: payload.aggregatedData || null,
      };
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      return rejectWithValue(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch AI health insights. Please try again.'
      );
    }
  },
);

export const fetchDailySummary = createAsyncThunk(
  'aiInsights/dailySummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getDailySummary();
      const data = res.data?.data;
      return (data && typeof data === 'object') 
        ? { ...DEFAULT_DAILY_SUMMARY, ...data }
        : DEFAULT_DAILY_SUMMARY;
    } catch (err) {
      console.error('Failed to fetch daily summary:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch daily summary');
    }
  },
);

export const fetchWeeklyFeedback = createAsyncThunk(
  'aiInsights/weeklyFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiInsightsAPI.getWeeklyFeedback();
      return res.data?.data || { weeklyFeedback: [] };
    } catch (err) {
      console.error('Failed to fetch weekly feedback:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch weekly feedback');
    }
  },
);

// ── Slice ──
const aiInsightsSlice = createSlice({
  name: 'aiInsights',
  initialState: {
    recommendations: [],
    dailySummary: DEFAULT_DAILY_SUMMARY,
    weeklyFeedback: [],
    aggregatedData: null,
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearAIInsights: (state) => {
      state.recommendations = [];
      state.dailySummary = DEFAULT_DAILY_SUMMARY;
      state.weeklyFeedback = [];
      state.aggregatedData = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Full insights
      .addCase(fetchAIHealthInsights.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchAIHealthInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.recommendations ?? [];
        state.dailySummary = action.payload.dailySummary ?? DEFAULT_DAILY_SUMMARY;
        state.weeklyFeedback = action.payload.weeklyFeedback ?? [];
        state.aggregatedData = action.payload.aggregatedData ?? null;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchAIHealthInsights.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload || 'Failed to load AI insights';
        // Reset to defaults on error to prevent crashes
        state.recommendations = [];
        state.weeklyFeedback = [];
        state.dailySummary = DEFAULT_DAILY_SUMMARY;
      })
      // Daily summary only
      .addCase(fetchDailySummary.fulfilled, (state, action) => { 
        state.dailySummary = action.payload ?? DEFAULT_DAILY_SUMMARY;
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.dailySummary = DEFAULT_DAILY_SUMMARY;
      })
      // Weekly feedback only
      .addCase(fetchWeeklyFeedback.fulfilled, (state, action) => { 
        state.weeklyFeedback = Array.isArray(action.payload?.weeklyFeedback) 
          ? action.payload.weeklyFeedback 
          : [];
      })
      .addCase(fetchWeeklyFeedback.rejected, (state, action) => {
        state.weeklyFeedback = [];
      });
  },
});

export const { clearAIInsights, clearError } = aiInsightsSlice.actions;
export default aiInsightsSlice.reducer;
