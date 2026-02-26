import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fitnessAPI } from '../../services/api/fitnessAPI';

export const fetchFitnessData = createAsyncThunk('fitness/fetchDaily', async () => (await fitnessAPI.getDaily()).data);
export const logWaterIntake = createAsyncThunk('fitness/logWater', async (ml) => (await fitnessAPI.logWater({ amount: ml })).data);
export const logDiet = createAsyncThunk('fitness/logDiet', async (data) => (await fitnessAPI.logDiet(data)).data);
export const logManualEntry = createAsyncThunk('fitness/logManual', async (data) => (await fitnessAPI.logManual(data)).data);

const slice = createSlice({
  name: 'fitness',
  initialState: { dailyData: null, weeklyData: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFitnessData.pending, (s) => { s.loading = true; })
     .addCase(fetchFitnessData.fulfilled, (s, a) => { s.loading = false; s.dailyData = a.payload; });
  },
});
export default slice.reducer;
