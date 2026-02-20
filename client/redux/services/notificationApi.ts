import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  issue: string;
}

interface NotificationResponse {
  success: boolean;
  notifications: NotificationItem[];
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/notifications",
    credentials: "include",
  }),
  tagTypes: ["Notifications"],

  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: (page = 1) => ({
        url: `/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ADD THIS
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/mark-all-read",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
