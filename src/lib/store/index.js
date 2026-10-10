import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/features/auth/api/auth-api";
import authReducer from "@/features/auth/store/auth-slice";
import { adminApi } from "@/features/admin/api/admin-api";
import { mockPrepApi } from "@/features/mock-prep/api/mock-prep-api";
import { profileApi } from "@/features/profile/api/profile-api";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [mockPrepApi.reducerPath]: mockPrepApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        profileApi.middleware,
        mockPrepApi.middleware,
        adminApi.middleware
      ),
  });
}

export const store = makeStore();
