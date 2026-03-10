import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthInsightAPI } from '../../services/api/healthInsightAPI';

export const fetchInsights = createAsyncThunk('healthInsight/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await healthInsightAPI.getInsights(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch insights');
  }
});

export const generateInsights = createAsyncThunk('healthInsight/generate', async (_, { rejectWithValue }) => {
  try {
    const res = await healthInsightAPI.generateInsights();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to generate insights');
  }
});

export const fetchHealthSummary = createAsyncThunk('healthInsight/summary', async (_, { rejectWithValue }) => {
  try {
    const res = await healthInsightAPI.getSummary();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
  }
});

export const dismissInsight = createAsyncThunk('healthInsight/dismiss', async (id, { rejectWithValue }) => {
  try {
    await healthInsightAPI.dismiss(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to dismiss');
  }
});

export const completeInsightAction = createAsyncThunk('healthInsight/completeAction', async ({ id, actionIndex }, { rejectWithValue }) => {
  try {
    const res = await healthInsightAPI.completeAction(id, actionIndex);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to complete action');
  }
});

const healthInsightSlice = createSlice({
  name: 'healthInsight',
  initialState: {
    insights: [],
    summary: null,
    pagination: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => { state.loading = true; })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload.insights;
        state.summary = action.payload.summary;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInsights.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(generateInsights.pending, (state) => { state.generating = true; })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.generating = false;
        state.insights = [...action.payload, ...state.insights];
      })
      .addCase(generateInsights.rejected, (state, action) => { state.generating = false; state.error = action.payload; })
      .addCase(fetchHealthSummary.fulfilled, (state, action) => { state.summary = action.payload; })
      .addCase(dismissInsight.fulfilled, (state, action) => {
        state.insights = state.insights.filter((i) => i._id !== action.payload);
      })
      .addCase(completeInsightAction.fulfilled, (state, action) => {
        const idx = state.insights.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.insights[idx] = action.payload;
      });
  },
});

export default healthInsightSlice.reducer;
