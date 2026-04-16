import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicationAPI } from '../../services/api/medicationAPI';

/**
 * Async thunks with improved error handling
 */
export const fetchMedications = createAsyncThunk(
  'medication/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await medicationAPI.getAll();
      if (!res.data) {
        throw new Error('Invalid response structure');
      }
      return res.data?.data?.medications ?? res.data?.medications ?? [];
    } catch (err) {
      console.error('[Medication] Fetch error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to fetch medications',
        status: err.response?.status,
        details: err.message,
      });
    }
  }
);

export const addMedication = createAsyncThunk(
  'medication/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await medicationAPI.create(data);
      return res.data?.data ?? res.data;
    } catch (err) {
      console.error('[Medication] Add error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to add medication',
        status: err.response?.status,
      });
    }
  }
);

export const updateMedication = createAsyncThunk(
  'medication/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await medicationAPI.update(id, data);
      return res.data?.data ?? res.data;
    } catch (err) {
      console.error('[Medication] Update error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to update medication',
        status: err.response?.status,
      });
    }
  }
);

export const deleteMedication = createAsyncThunk(
  'medication/delete',
  async (id, { rejectWithValue }) => {
    try {
      await medicationAPI.delete(id);
      return id;
    } catch (err) {
      console.error('[Medication] Delete error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to delete medication',
        status: err.response?.status,
      });
    }
  }
);

export const markAsTaken = createAsyncThunk(
  'medication/markAsTaken',
  async (id, { rejectWithValue }) => {
    try {
      const res = await medicationAPI.markAsTaken(id);
      return { id, data: res.data?.data };
    } catch (err) {
      console.error('[Medication] Mark as taken error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to mark medication as taken',
        status: err.response?.status,
      });
    }
  }
);

/**
 * Medication slice with comprehensive state management
 */
const medicationSlice = createSlice({
  name: 'medication',
  initialState: {
    medications: [],
    loading: false,
    loadingAction: null, // Track which action is loading
    error: null,
    lastFetched: null,
    syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medications
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.loadingAction = 'fetchMedications';
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingAction = null;
        state.medications = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetched = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.loadingAction = null;
        state.error = action.payload;
        state.syncStatus = 'error';
      })

      // Add medication
      .addCase(addMedication.pending, (state) => {
        state.loadingAction = 'addMedication';
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.loadingAction = null;
        if (action.payload && action.payload._id) {
          state.medications.push(action.payload);
        }
      })
      .addCase(addMedication.rejected, (state, action) => {
        state.loadingAction = null;
        state.error = action.payload;
      })

      // Update medication
      .addCase(updateMedication.pending, (state) => {
        state.loadingAction = 'updateMedication';
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        state.loadingAction = null;
        const index = state.medications.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.medications[index] = action.payload;
        }
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.loadingAction = null;
        state.error = action.payload;
      })

      // Delete medication
      .addCase(deleteMedication.pending, (state) => {
        state.loadingAction = 'deleteMedication';
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.loadingAction = null;
        state.medications = state.medications.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.loadingAction = null;
        state.error = action.payload;
      })

      // Mark as taken
      .addCase(markAsTaken.pending, (state) => {
        state.loadingAction = 'markAsTaken';
      })
      .addCase(markAsTaken.fulfilled, (state, action) => {
        state.loadingAction = null;
        const med = action.payload.data?.medication;
        if (med) {
          const index = state.medications.findIndex((m) => m._id === med._id);
          if (index !== -1) {
            state.medications[index] = med;
          }
        }
      })
      .addCase(markAsTaken.rejected, (state, action) => {
        state.loadingAction = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSyncStatus } = medicationSlice.actions;
export default medicationSlice.reducer;

