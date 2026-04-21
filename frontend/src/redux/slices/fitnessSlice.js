import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fitnessAPI } from '../../services/api/fitnessAPI';
import { syncGoogleFitData } from '../../services/googleFit/googleFitDataSync';

const mapFitnessEntry = (payload, prev) => {
  const base = prev || {};
  const raw = payload?.data ?? payload;
  const entry = Array.isArray(raw) ? raw[0] : raw;
  if (!entry) return base;
  return {
    ...base,
    steps: entry.steps?.count ?? base.steps,
    sleep: entry.sleep?.duration ?? base.sleep,
    calories: entry.calories?.burned ?? base.calories,
    lastSynced: entry.updatedAt || entry.date || base.lastSynced || null,
  };
};

const mapWaterEntry = (payload, prev) => {
  const base = prev || {};
  const water = payload?.data ?? payload;
  if (!water) return base;
  return {
    ...base,
    water: water.totalAmount ?? base.water,
  };
};

export const fetchFitnessData = createAsyncThunk('fitness/fetchDaily', async (_, { rejectWithValue }) => {
  try {
    const [fitnessRes, waterRes] = await Promise.all([
      fitnessAPI.getDaily(),
      fitnessAPI.getWaterDaily(),
    ]);
    const fitnessPayload = fitnessRes.data;
    const waterPayload = waterRes.data;
    const mapped = mapFitnessEntry(fitnessPayload, {});
    const withWater = mapWaterEntry(waterPayload, mapped);
    return withWater;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Fetch failed');
  }
});
export const fetchWeeklyChart = createAsyncThunk('fitness/fetchWeeklyChart', async (_, { rejectWithValue }) => {
  try { return (await fitnessAPI.getWeeklyChart()).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Fetch failed'); }
});
export const fetchWeeklyStats = createAsyncThunk('fitness/fetchWeeklyStats', async (_, { rejectWithValue }) => {
  try { return (await fitnessAPI.getWeeklyStats()).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Fetch failed'); }
});
export const logWaterIntake = createAsyncThunk('fitness/logWater', async (ml) => (await fitnessAPI.logWater({ amount: ml })).data);
export const logDiet = createAsyncThunk('fitness/logDiet', async (data) => (await fitnessAPI.logDiet(data)).data);
export const logManualEntry = createAsyncThunk('fitness/logManual', async (data) => (await fitnessAPI.logManual(data)).data);
export const logExercise = createAsyncThunk('fitness/logExercise', async (data) => (await fitnessAPI.logExercise(data)).data);
export const updateFitnessGoals = createAsyncThunk('fitness/updateGoals', async (data) => (await fitnessAPI.updateGoals(data)).data);
export const fetchMealHistory = createAsyncThunk('fitness/fetchMealHistory', async (params) => (await fitnessAPI.getMealHistory(params)).data);
export const deleteMeal = createAsyncThunk('fitness/deleteMeal', async (mealId) => (await fitnessAPI.deleteMeal(mealId)).data);

export const syncGoogleFitThunk = createAsyncThunk('fitness/syncGoogleFit', async (_, { rejectWithValue }) => {
  try {
    const res = await syncGoogleFitData();
    return res.data;
  } catch (e) {
    return rejectWithValue(e.message || e.response?.data?.message || 'Google Fit sync failed');
  }
});

const slice = createSlice({
  name: 'fitness',
  initialState: {
    dailyData: null,
    weeklyData: null,
    weeklyChart: null,
    mealHistory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFitnessData.pending, (s) => { s.loading = true; })
      .addCase(fetchFitnessData.fulfilled, (s, a) => { s.loading = false; s.dailyData = a.payload; })
      .addCase(fetchFitnessData.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(syncGoogleFitThunk.pending, (s) => { s.loading = true; })
      .addCase(syncGoogleFitThunk.fulfilled, (s, a) => { s.loading = false; s.dailyData = mapFitnessEntry(a.payload, s.dailyData); })
      .addCase(syncGoogleFitThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchWeeklyChart.fulfilled, (s, a) => { s.weeklyChart = a.payload; })
      .addCase(fetchWeeklyStats.fulfilled, (s, a) => { s.weeklyData = a.payload; })
      .addCase(logExercise.fulfilled, (s, a) => { s.dailyData = mapFitnessEntry(a.payload, s.dailyData); })
      .addCase(logManualEntry.fulfilled, (s, a) => { s.dailyData = mapFitnessEntry(a.payload, s.dailyData); })
      .addCase(logWaterIntake.fulfilled, (s, a) => { s.dailyData = mapWaterEntry(a.payload, s.dailyData); })
      .addCase(updateFitnessGoals.fulfilled, (s, a) => { s.dailyData = mapFitnessEntry(a.payload, s.dailyData); })
      .addCase(fetchMealHistory.fulfilled, (s, a) => { s.mealHistory = a.payload; })
      .addCase(deleteMeal.fulfilled, (s, a) => { s.dailyData = mapFitnessEntry(a.payload, s.dailyData); });
  },
});
export default slice.reducer;
