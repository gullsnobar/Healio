import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportAPI } from '../../services/api/reportAPI';

export const fetchWeeklyReport = createAsyncThunk('report/fetchWeekly', async () => (await reportAPI.getWeekly()).data);
export const fetchMonthlyReport = createAsyncThunk('report/fetchMonthly', async () => (await reportAPI.getMonthly()).data);

const slice = createSlice({
  name: 'report',
  initialState: { weeklyReport: null, monthlyReport: null, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWeeklyReport.fulfilled, (s, a) => { s.weeklyReport = a.payload; })
     .addCase(fetchMonthlyReport.fulfilled, (s, a) => { s.monthlyReport = a.payload; });
  },
});
export default slice.reducer;
