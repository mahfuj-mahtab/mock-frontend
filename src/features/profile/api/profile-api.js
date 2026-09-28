import { createApi } from "@reduxjs/toolkit/query/react";

import { authApi } from "@/features/auth/api/auth-api";
import { baseQueryWithReauth } from "@/lib/api/base-query";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Experiences", "Education", "Skills"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/profile/",
      providesTags: ["Profile"],
      transformResponse: (response) => response.data,
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            authApi.endpoints.getMe.initiate(undefined, {
              subscribe: false,
              forceRefetch: true,
            })
          );
        } catch {
          // handled by component
        }
      },
    }),
    getExperiences: builder.query({
      query: () => "/profile/experiences/",
      providesTags: ["Experiences"],
      transformResponse: (response) => response.data,
    }),
    createExperience: builder.mutation({
      query: (body) => ({
        url: "/profile/experiences/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Experiences"],
      transformResponse: (response) => response.data,
    }),
    updateExperience: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/profile/experiences/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "Experiences"],
      transformResponse: (response) => response.data,
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/profile/experiences/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile", "Experiences"],
    }),
    getEducation: builder.query({
      query: () => "/profile/education/",
      providesTags: ["Education"],
      transformResponse: (response) => response.data,
    }),
    createEducation: builder.mutation({
      query: (body) => ({
        url: "/profile/education/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Education"],
      transformResponse: (response) => response.data,
    }),
    updateEducation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/profile/education/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "Education"],
      transformResponse: (response) => response.data,
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({
        url: `/profile/education/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile", "Education"],
    }),
    getSkills: builder.query({
      query: () => "/profile/skills/",
      providesTags: ["Skills"],
      transformResponse: (response) => response.data,
    }),
    createSkill: builder.mutation({
      query: (body) => ({
        url: "/profile/skills/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Skills"],
      transformResponse: (response) => response.data,
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/profile/skills/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "Skills"],
      transformResponse: (response) => response.data,
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/profile/skills/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile", "Skills"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = profileApi;
