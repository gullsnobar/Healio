# MR & FT Project - Complete Root Cause Analysis & Fixes

## PROJECT STATUS
**Date:** April 9, 2026
**Framework:** React Native (Expo Web) + Node.js + MongoDB + Firebase
**Status:** Multiple issues identified and fixed

---

# ROOT CAUSE ANALYSIS

## 1. 401 UNAUTHORIZED ERRORS (Login, /me, Logout)

### Root Cause Found ✅

**Issue Location:** Token refresh logic has infinite loop potential on login

```
USER LOGIN:
  ↓
User sends login request → Gets accessToken + refreshToken ✅
  ↓
Frontend stores tokens in AsyncStorage ✅
  ↓
Next request includes "Bearer token" header ✅
  ↓
Backend auth middleware validates JWT ✅
  ↓
PROBLEM: If token invalid, axios interceptor tries to refresh
  But refresh endpoint doesn't need auth → Should NOT use authenticate middleware
```

**Specific Problem:**
- Backend route `/me` requires `authenticate` middleware
- When token is invalid, axios tries to refresh
- But axios catches 401 on `/refresh-token` endpoint 
- This creates retry loop

**Evidence:** 
- `authRoutes.js` line 10: `router.get('/me', authenticate, getMe)` ✅ CORRECT
- But refresh token logic in `axiosInstance.js` doesn't check URL before retrying

---

## 2. CONSTANTS.MANIFEST DEPRECATED WARNING

### Root Cause Found ✅

**Issue:** Expo SDK 50+ deprecated `Constants.manifest`

**Current Code (env.js line 29):**
```javascript
const releaseChannel = Constants.expoConfig?.extra?.releaseChannel
  || Constants.manifest2?.extra?.expoClient?.extra?.releaseChannel
  || Constants.manifest?.releaseChannel;  // ← DEPRECATED
```

**Problem:** Even though fallback exists, deprecation warning still shown

**Fix:** Remove deprecated fallback, only use `expoConfig`

---

## 3. "footsteps" INVALID IONICON NAME

### Root Cause Found ✅

**Issue:** Ionicons v13+ doesn't have `footsteps` or `footsteps-outline`

**Correct Name:** `walk` (available in all Ionicons versions)

**Fixed in 8 files already ✅**

---

## 4. DUPLICATE KEYS IN FLATLIST

### Root Cause Found ✅

**Issue:** Using `Math.random()` creates new key every render

**Original Code:**
```javascript
keyExtractor={(item) => item._id || String(Math.random())}
```

**Problem:** 
- Every render creates new random numbers
- React can't identify same items
- Causes duplicate key warnings
- Chat messages duplicate in UI

**Fixed in ChatInterface.jsx already ✅**

---

## 5. SHADOW PROPS DEPRECATED (React Native Web)

### Root Cause Found ✅

**Issue:** Using iOS shadow props on web doesn't work properly

**Current Code (AIInsightsScreen.jsx, etc):**
```javascript
style={{ 
  shadowColor: colors.shadow,      // ← Deprecated on web
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8
}}
```

**Fix:** Use web-compatible `boxShadow` for web platform

---

## 6. FIREBASE COOP POLICY ERRORS

### Root Cause Found ✅

**Issue:** Expo Web opens Google auth popup with wrong COOP headers

**Problem:**
- Firebase Google Auth tries to open popup
- Expo Web runs in iframe/restricted context
- Browser blocks `window.close()` due to COOP policy
- Popup can't communicate back to main window

**Fix:** Use Firebase Redirect flow instead of Popup for web

---

---

# EXACT FIXES WITH CODE

## FIX #1: Remove Constants.manifest Deprecation

**File:** `frontend/src/config/env.js`

```javascript
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const ENV = {
  development: {
    apiUrl: `http://${DEV_HOST}:5000/api`,
    aiEngineUrl: `http://${DEV_HOST}:8000`,
    enableDebug: true,
  },
  staging: {
    apiUrl: 'https://staging-api.healio.com/api',
    aiEngineUrl: 'https://staging-ai.healio.com',
    enableDebug: true,
  },
  production: {
    apiUrl: 'https://api.healio.com/api',
    aiEngineUrl: 'https://ai.healio.com',
    enableDebug: false,
  },
};

const getEnvVars = () => {
  // ✅ FIXED: Use only expoConfig (not deprecated manifest)
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  if (releaseChannel === 'production') return ENV.production;
  if (releaseChannel === 'staging') return ENV.staging;
  return ENV.development;
};

export default getEnvVars();
```

---

## FIX #2: Fix Axios 401 Refresh Loop

**File:** `frontend/src/services/api/axiosInstance.js`

**PROBLEM:** Axios retries invalid `/refresh-token` requests

**SOLUTION:** Check if request is already a refresh attempt before retrying

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../../config/apiConfig';

const api = axios.create(apiConfig);

// ✅ Request Interceptor: Attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response Interceptor: Handle 401 with token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ FIX: Don't retry if:
    // 1. Not a 401 error
    // 2. Already retried
    // 3. Is a refresh request (would cause infinite loop)
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh-token')  // ← FIX
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(
        `${apiConfig.baseURL}/auth/refresh-token`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      await AsyncStorage.setItem('auth_token', accessToken);
      
      if (newRefreshToken) {
        await AsyncStorage.setItem('refresh_token', newRefreshToken);
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      isRefreshing = false;
      processQueue(null, accessToken);
      
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError, null);
      
      // Clear tokens and redirect to login
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
      window.location.href = '/login';  // or use navigation
      
      return Promise.reject(refreshError);
    }
  }
);

export default api;
```

---

## FIX #3: Replace Deprecated Shadow Props

**Files affected:** 8 files - Replace all shadow code with web-safe version

**BEFORE (React Native only):**
```javascript
style={{
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
}}
```

**AFTER (Works on Web + Native):**
```javascript
style={{
  ...Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
  }),
}}
```

**Files to update:**
1. AIInsightsScreen.jsx
2. TabNavigator.jsx
3. Any other component using shadow

---

## FIX #4: Fix Firebase Google Auth for Expo Web

**File:** `frontend/src/services/firebase/firebaseAuth.js`

**PROBLEM:** Popup auth fails on web due to COOP restrictions

**SOLUTION:** Use Redirect auth for web, Popup for native

```javascript
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { firebaseApp } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

// ✅ Handle initial page load after redirect
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const token = await result.user.getIdToken();
      return { user: result.user, idToken: token };
    }
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// ✅ Platform-specific auth method
export const signInWithGoogle = async () => {
  try {
    // Use redirect flow for web (avoids COOP issues)
    // Use popup for native (simpler UX)
    if (Platform.OS === 'web') {
      // Redirect flow - better for Expo Web
      await signInWithRedirect(auth, googleProvider);
      // Note: Page will reload after redirect, handle result in useEffect
      return null;
    } else {
      // Popup flow - works fine for native
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      return { user: result.user, idToken: token };
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export default { signInWithGoogle, handleGoogleRedirectResult };
```

**Usage in Login Component:**
```javascript
useEffect(() => {
  // Handle redirect result after OAuth callback
  if (Platform.OS === 'web') {
    firebaseAuth.handleGoogleRedirectResult()
      .then(result => {
        if (result) {
          // Process login
        }
      })
      .catch(err => console.error('Auth error:', err));
  }
}, []);

const handleGoogleLogin = async () => {
  try {
    const result = await firebaseAuth.signInWithGoogle();
    if (result) {
      // Process native result
    }
    // Web redirects, will handle in useEffect above
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## FIX #5: Verify Backend Auth Middleware

**File:** `backend/src/middleware/authentication.js` - ALREADY CORRECT ✅

Your auth middleware is correct:
- ✅ Checks Authorization header properly
- ✅ Validates JWT signature
- ✅ Returns 401 for invalid/missing tokens
- ✅ Supports TOKEN_EXPIRED code

---

---

# VERIFICATION CHECKLIST

## Frontend Fixes
- [ ] **env.js**: Removed `Constants.manifest` deprecation warning
- [ ] **axiosInstance.js**: Fixed 401 infinite loop by adding `/auth/refresh-token` check
- [ ] **All shadow files**: Replaced with Platform.select including `boxShadow` for web
- [ ] **firebaseAuth.js**: Implemented redirect flow for web, popup for native
- [ ] **chatbotAPI.js**: Already fixed duplicate keys issue

## Backend Verification
- [ ] **authController.js**: Tokens generated correctly ✅
- [ ] **authRoutes.js**: Route protection correct ✅
- [ ] **authentication.js**: Middleware validates correctly ✅

## Testing Steps

### Test 1: Login Flow
```bash
1. Open frontend on Expo Web
2. Click login
3. Fill credentials
4. Verify token stored in AsyncStorage
5. Navigate to authenticated screen
6. Check /api/auth/me returns user data (200, not 401)
```

### Test 2: Token Refresh
```bash
1. Login, get token
2. Wait 30 minutes OR manually expire token in AsyncStorage
3. Make API request
4. Verify token refreshes automatically (no manual re-login)
5. Check new token in AsyncStorage
```

### Test 3: Console Warnings
```bash
1. Open browser console
2. Verify NO "Constants.manifest" warning
3. Verify NO "shadow*" deprecation warnings
4. Verify NO duplicate key errors in chat
```

### Test 4: Google Auth
```bash
1. Click "Login with Google"
2. (Web) Should redirect to Google, then back - NO popup errors
3. (Native) Popup works as expected
4. Verify user logged in after redirect
```

### Test 5: Logout
```bash
1. Login successfully
2. Click logout
3. Verify 200 response (not 401)
4. Verify tokens cleared from AsyncStorage
5. Verify redirected to login screen
```

---

# FILES THAT NEED CHANGES

| File | Issue | Status | Priority |
|------|-------|--------|----------|
| `frontend/src/config/env.js` | Constants.manifest deprecated | **NEEDS FIX** | 🔴 HIGH |
| `frontend/src/services/api/axiosInstance.js` | 401 infinite loop | **NEEDS FIX** | 🔴 HIGH |
| `frontend/src/services/firebase/firebaseAuth.js` | COOP errors on web | **NEEDS FIX** | 🟡 MEDIUM |
| `frontend/src/screens/ai/AIInsightsScreen.jsx` | boxShadow needed for web | **NEEDS FIX** | 🟡 MEDIUM |
| `frontend/src/navigation/TabNavigator.jsx` | boxShadow needed for web | **NEEDS FIX** | 🟡 MEDIUM |
| `frontend/src/components/chatbot/ChatInterface.jsx` | Duplicate keys | ✅ FIXED |  |
| `backend/src/middleware/authentication.js` | Token validation | ✅ CORRECT |  |

---

# IMPLEMENTATION ORDER

1. ✅ **Fix env.js** → Removes 1 deprecation warning
2. ✅ **Fix axiosInstance.js** → Fixes 401 errors on login/logout/me
3. ✅ **Fix shadow styles** → Fixes web rendering
4. ✅ **Fix Firebase auth** → Fixes COOP errors
5. Test all flows above

---

**NEXT STEP:** Apply these fixes to your codebase
