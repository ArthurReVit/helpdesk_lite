import { createSlice } from "@reduxjs/toolkit";
import { ticketTagApi } from "./ticketTagApi";

type TicketTagState = {
  lastTagError: string | null;
};

const initialState: TicketTagState = {
  lastTagError: null,
};

const ticketTagSlice = createSlice({
  name: "ticketTags",
  initialState,
  reducers: {
    clearTicketTagErrors(state) {
      state.lastTagError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ticketTagApi.endpoints.listTicketTags.matchRejected,
      (state, action) => {
        state.lastTagError = action.error?.message || "Failed to load tags";
      },
    );
    builder.addMatcher(
      ticketTagApi.endpoints.listTicketTags.matchFulfilled,
      (state) => {
        state.lastTagError = null;
      },
    );
  },
});

export const ticketTagActions = ticketTagSlice.actions;
export const ticketTagReducer = ticketTagSlice.reducer;
