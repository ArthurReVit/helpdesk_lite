import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./userApi";

type UserState = {
  lastRegisterMessage: string | null;
  lastRegisterError: string | null;
};

const initialState: UserState = {
  lastRegisterMessage: null,
  lastRegisterError: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearRegisterStatus(state) {
      state.lastRegisterMessage = null;
      state.lastRegisterError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.registerUser.matchFulfilled,
      (state, action) => {
        state.lastRegisterMessage = action.payload.message;
        state.lastRegisterError = null;
      },
    );
    builder.addMatcher(
      userApi.endpoints.registerUser.matchRejected,
      (state, action) => {
        state.lastRegisterMessage = null;
        state.lastRegisterError =
          action.error?.message || "Registration failed";
      },
    );
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
