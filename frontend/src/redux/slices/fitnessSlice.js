import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fitnessAPI } from '../../services/api/fitnessAPI';

export const fetchFitnessData = createAsyncThunk('fitness/fetchDaily', async (_, { rejectWithValue }) => {
  try { return (await fitnessAPI.getDaily()).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Fetch failed'); }
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
     .addCase(fetchWeeklyChart.fulfilled, (s, a) => { s.weeklyChart = a.payload; })
     .addCase(fetchWeeklyStats.fulfilled, (s, a) => { s.weeklyData = a.payload; })
     .addCase(logExercise.fulfilled, (s, a) => { s.dailyData = a.payload; })
     .addCase(updateFitnessGoals.fulfilled, (s, a) => { s.dailyData = a.payload; })
     .addCase(fetchMealHistory.fulfilled, (s, a) => { s.mealHistory = a.payload; })
     .addCase(deleteMeal.fulfilled, (s, a) => { s.dailyData = a.payload; });
  },
});
export default slice.reducer;
