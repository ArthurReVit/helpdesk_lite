import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { authReducer } from "./authSlice";
import { userApi } from "./userApi";
import { userReducer } from "./userSlice";
import { ticketApi } from "./ticketApi";
import { ticketReducer } from "./ticketSlice";
import { tagApi } from "./tagApi";
import { tagReducer } from "./tagSlice";
import { ticketTagApi } from "./ticketTagApi";
import { ticketTagReducer } from "./ticketTagSlice";
import { ticketCommentsApi } from "./ticketCommentsApi";
import { ticketCommentsReducer } from "./ticketCommentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    tickets: ticketReducer,
    tags: tagReducer,
    ticketTags: ticketTagReducer,
    ticketComments: ticketCommentsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    [ticketTagApi.reducerPath]: ticketTagApi.reducer,
    [ticketCommentsApi.reducerPath]: ticketCommentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      ticketApi.middleware,
      tagApi.middleware,
      ticketTagApi.middleware,
      ticketCommentsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
