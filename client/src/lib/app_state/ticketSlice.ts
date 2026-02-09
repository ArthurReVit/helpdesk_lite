import { createSlice } from "@reduxjs/toolkit";
import { ticketApi } from "./ticketApi";

type TicketState = {
  lastListError: string | null;
};

const initialState: TicketState = {
  lastListError: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketErrors(state) {
      state.lastListError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ticketApi.endpoints.listTickets.matchRejected,
      (state, action) => {
        state.lastListError = action.error?.message || "Failed to load tickets";
      },
    );
    builder.addMatcher(ticketApi.endpoints.listTickets.matchFulfilled, (state) => {
      state.lastListError = null;
    });
  },
});

export const ticketActions = ticketSlice.actions;
export const ticketReducer = ticketSlice.reducer;
