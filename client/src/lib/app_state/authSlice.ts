import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { clearAuthToken } from "./authCookies";
import type { AuthUserModel } from "../../models/auth";

type AuthState = {
  user: AuthUserModel | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      clearAuthToken();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user;
      },
    );
    builder.addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
