import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicationAPI } from '../../services/api/medicationAPI';

export const fetchMedications = createAsyncThunk('medication/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await medicationAPI.getAll(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const addMedication = createAsyncThunk('medication/add', async (data, { rejectWithValue }) => {
  try { const res = await medicationAPI.create(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateMedication = createAsyncThunk('medication/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await medicationAPI.update(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const deleteMedication = createAsyncThunk('medication/delete', async (id, { rejectWithValue }) => {
  try { await medicationAPI.delete(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const medicationSlice = createSlice({
  name: 'medication',
  initialState: { medications: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => { state.loading = true; })
      .addCase(fetchMedications.fulfilled, (state, action) => { state.loading = false; state.medications = action.payload; })
      .addCase(fetchMedications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addMedication.fulfilled, (state, action) => { state.medications.push(action.payload); })
      .addCase(updateMedication.fulfilled, (state, action) => { const i = state.medications.findIndex(m => m._id === action.payload._id); if (i !== -1) state.medications[i] = action.payload; })
      .addCase(deleteMedication.fulfilled, (state, action) => { state.medications = state.medications.filter(m => m._id !== action.payload); });
  },
});

export default medicationSlice.reducer;
