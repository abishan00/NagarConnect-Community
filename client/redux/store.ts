import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { issueApi } from "./services/issueApi";
import { adminApi } from "./services/adminApi";
import { dashboardApi } from "./services/dashboardApi";
import { notificationApi } from "./services/notificationApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [issueApi.reducerPath]: issueApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      issueApi.middleware,
      adminApi.middleware,
      dashboardApi.middleware,
      notificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
