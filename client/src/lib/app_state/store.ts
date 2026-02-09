import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { authReducer } from "./authSlice";
import { userApi } from "./userApi";
import { userReducer } from "./userSlice";
import { ticketApi } from "./ticketApi";
import { ticketReducer } from "./ticketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    tickets: ticketReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      ticketApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
