import { createApi } from "@reduxjs/toolkit/query/react";

import { logout, setCredentials, setUser } from "@/features/auth/store/auth-slice";
import { baseQueryWithReauth } from "@/lib/api/base-query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(
              setCredentials({
                user: data.data.user,
                access: data.data.access,
                refresh: data.data.refresh,
              })
            );
          }
        } catch {
          // handled by component
        }
      },
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(
              setCredentials({
                user: data.data.user,
                access: data.data.access,
                refresh: data.data.refresh,
              })
            );
          }
        } catch {
          // handled by component
        }
      },
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(
              setCredentials({
                user: getState().auth.user,
                access: data.data.access,
                refresh: data.data.refresh,
              })
            );
          }
        } catch {
          // handled by caller
        }
      },
    }),
    getMe: builder.query({
      query: () => "/auth/me/",
      providesTags: ["Me"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(setUser(data.data));
          }
        } catch {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
