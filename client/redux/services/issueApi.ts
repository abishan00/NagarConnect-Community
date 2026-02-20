import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/issues",
    credentials: "include",
  }),
  tagTypes: ["Issues"],

  endpoints: (builder) => ({
    createIssue: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Issues"],
    }),

    getMyIssues: builder.query({
      query: (page = 1) => ({
        url: `/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Issues"],
    }),

    // ADD THIS
    getSingleIssue: builder.query({
      query: (id: string) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Issues"],
    }),

    updateIssue: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Issues"],
    }),

    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issues"],
    }),
  }),
});

export const {
  useCreateIssueMutation,
  useGetMyIssuesQuery,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useGetSingleIssueQuery,
} = issueApi;
