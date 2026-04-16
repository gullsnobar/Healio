# **Quick Reference: Code Patterns & Best Practices**

## **Table of Contents**
1. Using the Enhanced API Service
2. Using the FAB Component
3. Creating Similar Redux Slices
4. Handling Loading States
5. Error Handling Patterns

---

## **1. Using the Enhanced API Service**

### **Basic GET Request with Caching**
```javascript
import apiService from '../../services/api/apiService';

// Fetch with automatic caching (5 min TTL)
const response = await apiService.get('/medications');
if (response.success) {
  console.log('Medications:', response.data);
  console.log('From cache?', response.cached);
} else {
  console.error('Error:', response.message);
}
```

### **POST Request (Create)**
```javascript
const response = await apiService.post('/medications', {
  name: 'Aspirin',
  dosage: '500mg',
  frequency: 'twice daily',
});

if (response.success) {
  console.log('Created:', response.data);
  // Cache automatically invalidated
} else {
  console.error('Failed:', response.error);
}
```

### **PUT Request (Update)**
```javascript
const response = await apiService.put('/medications/123', {
  dosage: '1000mg', // Updated dosage
});

if (response.success) {
  console.log('Updated:', response.data);
  // Related cache automatically cleared
}
```

### **DELETE Request**
```javascript
const response = await apiService.delete('/medications/123');

if (response.success) {
  console.log('Deleted successfully');
  // Related cache automatically cleared
}
```

### **Batch Operations (Parallel Requests)**
```javascript
// Send multiple requests in parallel
const responses = await apiService.batch([
  { method: 'GET', url: '/medications' },
  { method: 'GET', url: '/appointments' },
  { method: 'GET', url: '/reminders' },
]);

if (responses.success) {
  const [meds, appts, reminders] = responses.data;
  // All loaded in parallel
}
```

### **Manual Cache Management**
```javascript
// Clear specific cache
apiService.clearCache('GET:/medications');

// Clear all cache
apiService.clearCache();

// Check what's in cache
const cached = apiService.getFromCache('GET:/medications');
if (cached) {
  console.log('Found in cache:', cached);
}
```

### **Offline Sync**
```javascript
// Save data when offline
await apiService.syncData('/medications', newMedication);

// Later, when online, automatically retries
// Or manually retry all pending
await apiService.retrySyncQueue();
```

---

## **2. Using the FAB Component**

### **Import**
```javascript
import FAB from '../../components/common/FloatingActionButton';
```

### **Basic Usage**
```javascript
<FAB
  icon="add"
  onPress={() => navigation.navigate('AddScreen')}
/>
```

### **All Options**
```javascript
<FAB
  icon="add"                    // Icon name from Ionicons
  onPress={handlePress}         // Button press handler
  size="medium"                 // 'small' | 'medium' | 'large'
  position="bottom-right"       // Positioning on screen
  offsetX={20}                  // Horizontal offset from edge
  offsetY={100}                 // Vertical offset (accounts for tab bar)
  gradient={true}               // Use gradient or solid background
  colors={customColors}         // Optional custom color
/>
```

### **Multiple Sizes**
```javascript
// Small - Icon-only fits
<FAB size="small" offsetY={80} />

// Medium - Default, readable on all screens
<FAB size="medium" offsetY={100} />

// Large - More touch-friendly
<FAB size="large" offsetY={120} />
```

### **Different Icons**
```javascript
// Add
<FAB icon="add" />

// Upload
<FAB icon="cloud-upload" />

// Edit
<FAB icon="pencil" />

// Call
<FAB icon="call" />

// Share
<FAB icon="share-social" />

// Delete
<FAB icon="trash" />
```

### **Different Positions**
```javascript
// Default - bottom right
<FAB position="bottom-right" offsetX={20} offsetY={100} />

// Bottom left
<FAB position="bottom-left" offsetX={20} offsetY={100} />

// Top right
<FAB position="top-right" offsetX={20} offsetY={20} />

// Top left
<FAB position="top-left" offsetX={20} offsetY={20} />
```

---

## **3. Creating Similar Redux Slices**

### **Pattern: Enhanced Thunk with Error Handling**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../../services/api/appointmentAPI';

// Thunk with detailed error handling
export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await appointmentAPI.getAll();
      return res.data?.appointments ?? [];
    } catch (err) {
      console.error('[Appointment] Fetch error:', err);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to fetch appointments',
        status: err.response?.status,
        details: err.message,
      });
    }
  }
);

export const addAppointment = createAsyncThunk(
  'appointment/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await appointmentAPI.create(data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to add appointment',
        status: err.response?.status,
      });
    }
  }
);

// Enhanced slice with loading actions
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    appointments: [],
    loading: false,
    loadingAction: null,     // Track which action is loading
    error: null,              // Detailed error object
    lastFetched: null,        // For smart cache validation
    syncStatus: 'idle',       // 'idle' | 'syncing' | 'synced' | 'error'
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setSyncStatus: (state, action) => { state.syncStatus = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.loadingAction = 'fetchAppointments';
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingAction = null;
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetched = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.loadingAction = null;
        state.error = action.payload;
        state.syncStatus = 'error';
      })
      .addCase(addAppointment.pending, (state) => {
        state.loadingAction = 'addAppointment';
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.loadingAction = null;
        if (action.payload?._id) {
          state.appointments.push(action.payload);
        }
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.loadingAction = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSyncStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;
```

---

## **4. Handling Loading States in Components**

### **Complete Example: ListScreen with All States**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAppointments, clearError } from '../../redux/slices/appointmentSlice';

const AppointmentListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    appointments,
    loading,
    loadingAction,
    error,
    syncStatus,
  } = useSelector((state) => state.appointment);

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAppointments());
    }, [dispatch])
  );

  // Handle initial loading
  if (loading && appointments.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12 }}>Loading appointments...</Text>
      </View>
    );
  }

  // Handle error state with retry
  if (error && appointments.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={{ marginTop: 12, fontWeight: '600' }}>
          {error.message}
        </Text>
        <TouchableOpacity
          onPress={() => dispatch(fetchAppointments())}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle sync status indicator
  const getSyncStatusLabel = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'synced': return 'All synced ✓';
      case 'error': return 'Sync error';
      default: return '';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with sync status */}
      {syncStatus !== 'idle' && (
        <View style={styles.statusBar}>
          <Text>{getSyncStatusLabel()}</Text>
          <Ionicons
            name={syncStatus === 'synced' ? 'checkmark-circle' : 'sync'}
            color={syncStatus === 'synced' ? colors.success : colors.warning}
          />
        </View>
      )}

      {/* List of appointments */}
      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={colors.lightGray} />
            <Text style={{ marginTop: 12 }}>No appointments yet</Text>
          </View>
        }
        onRefresh={() => dispatch(fetchAppointments())}
        refreshing={loadingAction === 'fetchAppointments'}
      />

      {/* FAB */}
      <FAB
        icon="add"
        onPress={() => navigation.navigate('AddAppointment')}
        size="medium"
        position="bottom-right"
        offsetY={100}
      />

      {/* Error Toast */}
      {error && appointments.length > 0 && (
        <View style={[styles.errorToast, { backgroundColor: colors.errorLight }]}>
          <Text style={{ color: colors.error, flex: 1 }}>
            {error.message}
          </Text>
          <TouchableOpacity onPress={() => dispatch(clearError())}>
            <Ionicons name="close" color={colors.error} size={20} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
```

---

## **5. Error Handling Patterns**

### **API Error Response Format**
```javascript
// All API errors return this structure
{
  success: false,
  status: 400,                          // HTTP status code
  message: "User-friendly message",     // For UI display
  data: null,
  error: {
    code: "VALIDATION_ERROR",           // Error code for logging
    status: 400,                        // HTTP status
    details: {                          // Specific error details
      field: "email",
      issue: "already registered",
      suggestion: "Use forgot password"
    }
  }
}
```

### **Handle Different Error Types**
```javascript
const handleError = (error) => {
  if (!error) return;

  // Type 1: Network error
  if (error.code === 'ECONNABORTED') {
    showToast('Network request timeout');
  }
  
  // Type 2: Validation error
  else if (error.status === 400) {
    showFieldErrors(error.error.details);
  }
  
  // Type 3: Authentication error
  else if (error.status === 401) {
    logout();
  }
  
  // Type 4: Authorization error
  else if (error.status === 403) {
    showToast('You do not have permission');
  }
  
  // Type 5: Server error
  else if (error.status >= 500) {
    showToast('Server error. Please try again later.');
    reportToSentry(error);
  }
  
  // Generic error
  else {
    showToast(error.message);
  }
};
```

### **Retry Pattern**
```javascript
import { useCallback } from 'react';

const useRetry = (asyncFn, maxRetries = 3) => {
  const [retrying, setRetrying] = useState(false);

  const retry = useCallback(async () => {
    setRetrying(true);
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await asyncFn();
        setRetrying(false);
        return result;
      } catch (err) {
        lastError = err;
        if (i < maxRetries - 1) {
          // Exponential backoff
          const delay = 1000 * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    setRetrying(false);
    throw lastError;
  }, [asyncFn, maxRetries]);

  return { retry, retrying };
};

// Usage
const { retry, retrying } = useRetry(async () => {
  return await dispatch(fetchAppointments());
});

<TouchableOpacity onPress={retry} disabled={retrying}>
  <Text>{retrying ? 'Retrying...' : 'Retry'}</Text>
</TouchableOpacity>
```

---

## **Common Patterns Summary**

| Pattern | File | Purpose |
|---------|------|---------|
| API Caching | `apiService.js` | Avoid redundant network calls |
| Retry Logic | `apiService.executeWithRetry()` | Handle transient failures |
| Error Formatting | `apiService.formatError()` | Consistent error handling |
| Offline Sync | `apiService.syncData()` | Work offline, sync later |
| Redux Thunks | `medicationSlice.js` | Async state management |
| FAB Component | `FloatingActionButton.jsx` | Reusable UI button |
| Loading States | Components | User feedback during async ops |

---

## **Copy-Paste Templates**

### **New Screen with FAB**
```javascript
import React, { useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../styles/ThemeContext';
import FAB from '../../components/common/FloatingActionButton';
import { fetchItems } from '../../redux/slices/itemSlice';

const ItemListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.item);
  const { colors } = useAppTheme();

  useFocusEffect(useCallback(() => {
    dispatch(fetchItems());
  }, [dispatch]));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item._id}
      />
      <FAB
        icon="add"
        onPress={() => navigation.navigate('AddItem')}
        size="medium"
        position="bottom-right"
        offsetY={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ItemListScreen;
```

---

**Last Updated:** April 14, 2026  
**Version:** 1.0.0
