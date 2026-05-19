# Google Fit Sync - Refresh Token Error Fix

## Problem
The app was showing error: `GoogleFitSync: Sync failed: No refresh token`

This occurred when:
1. The app tried to sync Google Fit data
2. The authentication token expired
3. The refresh token was missing from AsyncStorage
4. The axios interceptor couldn't refresh the session

## Root Cause
The authentication system couldn't refresh the access token because the refresh token wasn't available in AsyncStorage. This could happen due to:
- App crash or forced closure during token storage
- AsyncStorage data cleared (cache clear, app data clear)
- Session timeout and token expiry without proper refresh

## Solution Implemented

### 1. **Enhanced Token Refresh Error Handling** ([axiosInstance.js](frontend/src/services/api/axiosInstance.js))
- Added better error detection for missing refresh tokens
- Created a specific error code (`NO_REFRESH_TOKEN`) to identify this scenario
- Improved error message: `"Session expired: Please log in again"`
- Ensures tokens are properly cleared when refresh fails

```javascript
if (!refreshToken) {
  const error = new Error('Session expired: Please log in again');
  error.code = 'NO_REFRESH_TOKEN';
  error.requiresReLogin = true;
  throw error;
}
```

### 2. **Improved Google Fit Sync Error Handling** ([googleFitDataSync.js](frontend/src/services/googleFit/googleFitDataSync.js))
- Added specific detection for session-expired errors
- Provides user-friendly error messages
- Distinguishes between auth errors and sync failures

```javascript
// Handle session expired / no refresh token case
if (error?.code === 'NO_REFRESH_TOKEN' || 
    errorMessage.includes('Session expired') || 
    errorMessage.includes('No refresh token')) {
  throw new Error('Session expired. Please log in again to continue syncing with Google Fit.');
}
```

### 3. **Updated Redux Thunk** ([fitnessSlice.js](frontend/src/redux/slices/fitnessSlice.js))
- Ensures detailed error messages are passed through to the UI
- Allows users to see clear, actionable error messages

## User-Facing Improvements

When Google Fit sync fails due to missing refresh token, users will now see:
- **Before**: `"GoogleFitSync: Sync failed: No refresh token"` (confusing)
- **After**: `"Session expired. Please log in again to continue syncing with Google Fit."` (clear action needed)

## How to Test

1. Open the Fitness screen
2. Click "Sync Now" on the Google Fit card
3. If you get the error, you'll now see a clear message asking you to log in again
4. After logging in, the sync should work properly

## Prevention Tips

To prevent this issue:
1. Keep the app updated
2. Avoid clearing app data/cache while logged in
3. Re-login if the app crashes
4. Keep session active when using Google Fit features

## Files Modified
- [frontend/src/services/api/axiosInstance.js](frontend/src/services/api/axiosInstance.js)
- [frontend/src/services/googleFit/googleFitDataSync.js](frontend/src/services/googleFit/googleFitDataSync.js)
- [frontend/src/redux/slices/fitnessSlice.js](frontend/src/redux/slices/fitnessSlice.js)
