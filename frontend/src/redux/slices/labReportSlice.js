import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { labReportAPI } from '../../services/api/labReportAPI';

export const fetchLabReports = createAsyncThunk('labReport/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await labReportAPI.getAll()).data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const uploadLabReport = createAsyncThunk('labReport/upload', async (data, { rejectWithValue }) => {
  try { return (await labReportAPI.upload(data)).data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const slice = createSlice({
  name: 'labReport',
  initialState: { reports: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchLabReports.pending, (s) => { s.loading = true; })
     .addCase(fetchLabReports.fulfilled, (s, a) => { s.loading = false; s.reports = a.payload; })
     .addCase(uploadLabReport.fulfilled, (s, a) => { s.reports.push(a.payload); });
  },
});
export default slice.reducer;
