import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trustedContactAPI } from '../../services/api/trustedContactAPI';

export const fetchContacts = createAsyncThunk('trustedContact/fetchAll', async () => (await trustedContactAPI.getAll()).data);
export const addContact = createAsyncThunk('trustedContact/add', async (data) => (await trustedContactAPI.add(data)).data);
export const deleteContact = createAsyncThunk('trustedContact/delete', async (id) => { await trustedContactAPI.delete(id); return id; });

const slice = createSlice({
  name: 'trustedContact',
  initialState: { contacts: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchContacts.fulfilled, (s, a) => { s.contacts = a.payload; })
     .addCase(addContact.fulfilled, (s, a) => { s.contacts.push(a.payload); })
     .addCase(deleteContact.fulfilled, (s, a) => { s.contacts = s.contacts.filter(c => c._id !== a.payload); });
  },
});
export default slice.reducer;
