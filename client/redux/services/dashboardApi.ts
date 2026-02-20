import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/admin",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAdminStats: builder.query<any, void>({
      query: () => "/stats",
    }),
  }),
});

export const { useGetAdminStatsQuery } = dashboardApi;
