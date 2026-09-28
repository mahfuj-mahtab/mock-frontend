import { createSlice } from "@reduxjs/toolkit";

import {
  AUTH_STORAGE_KEYS,
} from "@/features/auth/constants/storage";

const getStoredTokens = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }

  return {
    accessToken: localStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
  };
};

const persistTokens = (accessToken, refreshToken) => {
  if (typeof window === "undefined") {
    return;
  }

  if (accessToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  }
};

const clearStoredTokens = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
};

const storedTokens = getStoredTokens();

const initialState = {
  user: null,
  accessToken: storedTokens.accessToken,
  refreshToken: storedTokens.refreshToken,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh ?? state.refreshToken;
      state.isAuthenticated = true;
      state.isInitialized = true;
      persistTokens(access, refresh ?? state.refreshToken);
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    mergeUserProfile(state, action) {
      if (!state.user) {
        return;
      }

      state.user = {
        ...state.user,
        profile: {
          ...state.user.profile,
          ...action.payload,
        },
      };
    },
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      clearStoredTokens();
    },
  },
});

export const { setCredentials, setUser, mergeUserProfile, setInitialized, logout } =
  authSlice.actions;

export default authSlice.reducer;
