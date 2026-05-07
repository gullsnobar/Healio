import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trustedContactAPI } from '../../services/api/trustedContactAPI';

export const fetchContacts = createAsyncThunk('trustedContact/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await trustedContactAPI.getAll();
    return res.data?.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch contacts');
  }
});

export const addContact = createAsyncThunk('trustedContact/add', async (data, { rejectWithValue }) => {
  try {
    const res = await trustedContactAPI.add(data);
    return res.data?.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add contact');
  }
});

export const deleteContact = createAsyncThunk('trustedContact/delete', async (id, { rejectWithValue }) => {
  try {
    await trustedContactAPI.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete contact');
  }
});

const slice = createSlice({
  name: 'trustedContact',
  initialState: { contacts: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchContacts.pending, (s) => { s.loading = true; })
      .addCase(fetchContacts.fulfilled, (s, a) => { s.loading = false; s.contacts = a.payload; })
      .addCase(fetchContacts.rejected, (s) => { s.loading = false; })
      .addCase(addContact.pending, (s) => { s.loading = true; })
      .addCase(addContact.fulfilled, (s, a) => { s.loading = false; if (a.payload) s.contacts.unshift(a.payload); })
      .addCase(addContact.rejected, (s) => { s.loading = false; })
      .addCase(deleteContact.fulfilled, (s, a) => { s.contacts = s.contacts.filter(c => c._id !== a.payload); });
  },
});
export default slice.reducer;
