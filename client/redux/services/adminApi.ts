import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/admin",
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // getAllUsers: builder.query<any, string | void>({
    //   query: (search = "", page = 1) => ({
    //     url: `/users`,
    //     params: search ? { search } : {},
    //   }),
    //   providesTags: ["Users"],
    // }),

    getAllUsers: builder.query({
      query: ({ search = "", page = 1 }) =>
        `/users?search=${search}&page=${page}`,
    }),

    getSingleUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
    }),

    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;
