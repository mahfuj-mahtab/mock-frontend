import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/features/auth/api/auth-api";
import authReducer from "@/features/auth/store/auth-slice";
import { profileApi } from "@/features/profile/api/profile-api";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, profileApi.middleware),
  });
}

export const store = makeStore();
