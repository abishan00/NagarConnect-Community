import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1/auth",
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 400) {
    const refreshResult = await baseQuery(
      { url: "/refresh", method: "GET" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ================= AUTH =================

    registration: builder.mutation<
      any,
      {
        name: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),

    activateUser: builder.mutation<
      any,
      {
        activation_token: string;
        activation_code: string;
      }
    >({
      query: (body) => ({
        url: "/activate-user",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<
      any,
      {
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.query<any, void>({
      query: () => ({
        url: "/refresh",
        method: "GET",
      }),
    }),

    // ================= USER =================

    getUser: builder.query<any, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserInfo: builder.mutation<
      any,
      {
        name: string;
      }
    >({
      query: (body) => ({
        url: "/update-user-info",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updatePassword: builder.mutation<
      any,
      {
        oldPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: "/update-user-password",
        method: "PUT",
        body,
      }),
    }),

    updateAvatar: builder.mutation<
      any,
      {
        avatar: string;
      }
    >({
      query: (body) => ({
        url: "/update-avatar",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ================= PASSWORD =================

    forgotPassword: builder.mutation<
      any,
      {
        email: string;
      }
    >({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      any,
      {
        resetCode: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: "/reset-password",
        method: "PUT",
        body,
      }),
    }),
    deleteUser: builder.mutation<any, void>({
      query: () => ({
        url: "/delete-me",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useActivateUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenQuery,
  useGetUserQuery,
  useUpdateUserInfoMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
} = authApi;
