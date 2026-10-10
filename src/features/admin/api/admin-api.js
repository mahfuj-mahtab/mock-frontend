import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "@/lib/api/base-query";

function listTransform(response) {
  return {
    items: response.data ?? [],
    pagination: response.pagination ?? { count: 0, next: null, previous: null },
  };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminTracks", "AdminTechnologies", "AdminQuestions", "AdminMeta"],
  endpoints: (builder) => ({
    getAdminMeta: builder.query({
      query: () => "/admin/mock-prep/meta/",
      providesTags: ["AdminMeta"],
      transformResponse: (response) => response.data,
    }),
    getAdminTracks: builder.query({
      query: (params) => ({ url: "/admin/mock-prep/tracks/", params }),
      providesTags: ["AdminTracks"],
      transformResponse: listTransform,
    }),
    createAdminTrack: builder.mutation({
      query: (body) => ({
        url: "/admin/mock-prep/tracks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminTracks"],
      transformResponse: (response) => response.data,
    }),
    updateAdminTrack: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/mock-prep/tracks/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminTracks"],
      transformResponse: (response) => response.data,
    }),
    deleteAdminTrack: builder.mutation({
      query: (id) => ({
        url: `/admin/mock-prep/tracks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminTracks"],
    }),
    getAdminTechnologies: builder.query({
      query: (params) => ({ url: "/admin/mock-prep/technologies/", params }),
      providesTags: ["AdminTechnologies"],
      transformResponse: listTransform,
    }),
    createAdminTechnology: builder.mutation({
      query: (body) => ({
        url: "/admin/mock-prep/technologies/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminTechnologies"],
      transformResponse: (response) => response.data,
    }),
    updateAdminTechnology: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/mock-prep/technologies/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminTechnologies"],
      transformResponse: (response) => response.data,
    }),
    deleteAdminTechnology: builder.mutation({
      query: (id) => ({
        url: `/admin/mock-prep/technologies/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminTechnologies"],
    }),
    getAdminQuestions: builder.query({
      query: (params) => ({ url: "/admin/mock-prep/questions/", params }),
      providesTags: ["AdminQuestions"],
      transformResponse: listTransform,
    }),
    createAdminQuestion: builder.mutation({
      query: (body) => ({
        url: "/admin/mock-prep/questions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminQuestions"],
      transformResponse: (response) => response.data,
    }),
    updateAdminQuestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/mock-prep/questions/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminQuestions"],
      transformResponse: (response) => response.data,
    }),
    deleteAdminQuestion: builder.mutation({
      query: (id) => ({
        url: `/admin/mock-prep/questions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminQuestions"],
    }),
  }),
});

export const {
  useGetAdminMetaQuery,
  useGetAdminTracksQuery,
  useCreateAdminTrackMutation,
  useUpdateAdminTrackMutation,
  useDeleteAdminTrackMutation,
  useGetAdminTechnologiesQuery,
  useCreateAdminTechnologyMutation,
  useUpdateAdminTechnologyMutation,
  useDeleteAdminTechnologyMutation,
  useGetAdminQuestionsQuery,
  useCreateAdminQuestionMutation,
  useUpdateAdminQuestionMutation,
  useDeleteAdminQuestionMutation,
} = adminApi;
