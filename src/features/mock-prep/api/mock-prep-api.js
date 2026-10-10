import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "@/lib/api/base-query";
import { unwrapApiData } from "@/lib/api/transform-response";

export const mockPrepApi = createApi({
  reducerPath: "mockPrepApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["MockPrepSessions", "MockPrepSession"],
  endpoints: (builder) => ({
    getTracks: builder.query({
      query: () => "/mock-prep/tracks/",
      transformResponse: unwrapApiData,
    }),
    getTechnologies: builder.query({
      query: (trackId) => ({
        url: "/mock-prep/technologies/",
        params: trackId ? { track: trackId } : undefined,
      }),
      transformResponse: unwrapApiData,
    }),
    getSessions: builder.query({
      query: () => "/mock-prep/sessions/",
      providesTags: ["MockPrepSessions"],
      transformResponse: unwrapApiData,
    }),
    getSession: builder.query({
      query: (id) => `/mock-prep/sessions/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "MockPrepSession", id }],
      transformResponse: unwrapApiData,
    }),
    createSession: builder.mutation({
      query: (body) => ({
        url: "/mock-prep/sessions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MockPrepSessions"],
      transformResponse: unwrapApiData,
    }),
    startSession: builder.mutation({
      query: (id) => ({
        url: `/mock-prep/sessions/${id}/start/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        "MockPrepSessions",
        { type: "MockPrepSession", id },
      ],
      transformResponse: unwrapApiData,
    }),
    submitTurn: builder.mutation({
      query: ({ sessionId, content }) => ({
        url: `/mock-prep/sessions/${sessionId}/turns/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        "MockPrepSessions",
        { type: "MockPrepSession", id: sessionId },
      ],
      transformResponse: unwrapApiData,
    }),
    completeSession: builder.mutation({
      query: (id) => ({
        url: `/mock-prep/sessions/${id}/complete/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        "MockPrepSessions",
        { type: "MockPrepSession", id },
      ],
      transformResponse: unwrapApiData,
    }),
  }),
});

export const {
  useGetTracksQuery,
  useGetTechnologiesQuery,
  useGetSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
  useStartSessionMutation,
  useSubmitTurnMutation,
  useCompleteSessionMutation,
} = mockPrepApi;
