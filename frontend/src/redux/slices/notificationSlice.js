import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services/api/notificationAPI';

export const fetchNotifications = createAsyncThunk('notification/fetchAll', async () => (await notificationAPI.getAll()).data);
export const markAsRead = createAsyncThunk('notification/markRead', async (id) => { await notificationAPI.markRead(id); return id; });

const slice = createSlice({
  name: 'notification',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => { s.notifications = a.payload; s.unreadCount = a.payload.filter(n => !n.read).length; })
     .addCase(markAsRead.fulfilled, (s, a) => { const n = s.notifications.find(n => n._id === a.payload); if (n) { n.read = true; s.unreadCount--; } });
  },
});
export default slice.reducer;
