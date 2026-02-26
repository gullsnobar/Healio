import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../../services/api/appointmentAPI';

export const fetchAppointments = createAsyncThunk('appointment/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await appointmentAPI.getAll()).data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const addAppointment = createAsyncThunk('appointment/add', async (data, { rejectWithValue }) => {
  try { return (await appointmentAPI.create(data)).data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateAppointment = createAsyncThunk('appointment/update', async ({ id, data }, { rejectWithValue }) => {
  try { return (await appointmentAPI.update(id, data)).data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const deleteAppointment = createAsyncThunk('appointment/delete', async (id, { rejectWithValue }) => {
  try { await appointmentAPI.delete(id); return id; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const slice = createSlice({
  name: 'appointment',
  initialState: { appointments: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAppointments.pending, (s) => { s.loading = true; })
     .addCase(fetchAppointments.fulfilled, (s, a) => { s.loading = false; s.appointments = a.payload; })
     .addCase(fetchAppointments.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(addAppointment.fulfilled, (s, a) => { s.appointments.push(a.payload); })
     .addCase(deleteAppointment.fulfilled, (s, a) => { s.appointments = s.appointments.filter(i => i._id !== a.payload); });
  },
});
export default slice.reducer;
