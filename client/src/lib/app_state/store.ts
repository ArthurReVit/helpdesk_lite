import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { authReducer } from "./authSlice";
import { userApi } from "./userApi";
import { userReducer } from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
