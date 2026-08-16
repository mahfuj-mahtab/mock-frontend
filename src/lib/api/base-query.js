import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/constants/api";
import { logout, setCredentials } from "@/features/auth/store/auth-slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

async function executeRequest(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (!result.error) {
    return result;
  }

  const response = result.error.data;

  if (response && typeof response === "object" && "success" in response) {
    return {
      error: {
        status: result.error.status,
        data: response,
      },
    };
  }

  return result;
}

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await executeRequest(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const refreshToken = api.getState().auth.refreshToken;

  if (!refreshToken) {
    api.dispatch(logout());
    return result;
  }

  const refreshResult = await executeRequest(
    {
      url: "/auth/refresh/",
      method: "POST",
      body: { refresh: refreshToken },
    },
    api,
    extraOptions
  );

  if (refreshResult.error) {
    api.dispatch(logout());
    return result;
  }

  const payload = refreshResult.data;

  if (!payload?.success) {
    api.dispatch(logout());
    return result;
  }

  api.dispatch(
    setCredentials({
      user: api.getState().auth.user,
      access: payload.data.access,
      refresh: payload.data.refresh ?? refreshToken,
    })
  );

  result = await executeRequest(args, api, extraOptions);
  return result;
};
