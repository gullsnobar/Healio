import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reminderAPI } from '../../services/api/reminderAPI';

/* ── Thunks ─────────────────────────────────────────── */

export const fetchReminders = createAsyncThunk(
  'reminder/fetchAll',
  async (params, { rejectWithValue }) => {
    try { const res = await reminderAPI.getAll(params); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch reminders'); }
  },
);

export const fetchUpcomingReminders = createAsyncThunk(
  'reminder/fetchUpcoming',
  async (hours = 24, { rejectWithValue }) => {
    try { const res = await reminderAPI.getUpcoming(hours); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch upcoming reminders'); }
  },
);

export const addReminder = createAsyncThunk(
  'reminder/add',
  async (data, { rejectWithValue }) => {
    try { const res = await reminderAPI.create(data); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create reminder'); }
  },
);

export const updateReminder = createAsyncThunk(
  'reminder/update',
  async ({ id, data }, { rejectWithValue }) => {
    try { const res = await reminderAPI.update(id, data); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update reminder'); }
  },
);

export const deleteReminder = createAsyncThunk(
  'reminder/delete',
  async (id, { rejectWithValue }) => {
    try { await reminderAPI.delete(id); return id; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete reminder'); }
  },
);

export const completeReminder = createAsyncThunk(
  'reminder/complete',
  async (id, { rejectWithValue }) => {
    try { const res = await reminderAPI.complete(id); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to complete reminder'); }
  },
);

export const snoozeReminder = createAsyncThunk(
  'reminder/snooze',
  async ({ id, minutes }, { rejectWithValue }) => {
    try { const res = await reminderAPI.snooze(id, minutes); return res.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to snooze reminder'); }
  },
);

/* ── Slice ──────────────────────────────────────────── */

const reminderSlice = createSlice({
  name: 'reminder',
  initialState: {
    reminders: [],
    upcoming: [],
    pagination: null,
    loading: false,
    error: null,
    selectedType: null, // 'medication' | 'appointment' | 'lab' | null (all)
  },
  reducers: {
    setSelectedType: (state, action) => { state.selectedType = action.payload; },
    clearReminderError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchReminders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload.reminders || action.payload.data || action.payload;
        if (action.payload.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchReminders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Fetch upcoming
      .addCase(fetchUpcomingReminders.fulfilled, (state, action) => {
        state.upcoming = action.payload.data || action.payload;
      })
      // Add
      .addCase(addReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReminder.fulfilled, (state, action) => {
        state.loading = false;
        const reminder = action.payload.data || action.payload;
        state.reminders.unshift(reminder);
      })
      .addCase(addReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateReminder.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const i = state.reminders.findIndex(r => r._id === updated._id);
        if (i !== -1) state.reminders[i] = updated;
      })
      // Delete
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(r => r._id !== action.payload);
      })
      // Complete
      .addCase(completeReminder.fulfilled, (state, action) => {
        const completed = action.payload.data || action.payload;
        const i = state.reminders.findIndex(r => r._id === completed._id);
        if (i !== -1) state.reminders[i] = completed;
      })
      // Snooze
      .addCase(snoozeReminder.fulfilled, (state, action) => {
        const snoozed = action.payload.data || action.payload;
        const i = state.reminders.findIndex(r => r._id === snoozed._id);
        if (i !== -1) state.reminders[i] = snoozed;
      });
  },
});

export const { setSelectedType, clearReminderError } = reminderSlice.actions;
export default reminderSlice.reducer;
