import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services/api/notificationAPI';

export const fetchNotifications = createAsyncThunk('notification/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await notificationAPI.getAll();
    const data = res.data?.data || res.data;
    return { notifications: data.notifications || [], unreadCount: data.unreadCount || 0 };
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const markAsRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try { await notificationAPI.markRead(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const markAllRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try { await notificationAPI.markAllRead(); return true; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const slice = createSlice({
  name: 'notification',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true; })
      .addCase(fetchNotifications.fulfilled, (s, a) => { s.loading = false; s.notifications = a.payload.notifications; s.unreadCount = a.payload.unreadCount; })
      .addCase(fetchNotifications.rejected, (s) => { s.loading = false; })
      .addCase(markAsRead.fulfilled, (s, a) => { const n = s.notifications.find(n => n._id === a.payload); if (n) { n.isRead = true; s.unreadCount = Math.max(0, s.unreadCount - 1); } })
      .addCase(markAllRead.fulfilled, (s) => { s.notifications.forEach(n => { n.isRead = true; }); s.unreadCount = 0; });
  },
});
export default slice.reducer;
