import { createSlice } from "@reduxjs/toolkit";
import { ticketCommentsApi } from "./ticketCommentsApi";

type TicketCommentsState = {
  lastCommentsError: string | null;
};

const initialState: TicketCommentsState = {
  lastCommentsError: null,
};

const ticketCommentsSlice = createSlice({
  name: "ticketComments",
  initialState,
  reducers: {
    clearTicketCommentsErrors(state) {
      state.lastCommentsError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ticketCommentsApi.endpoints.listTicketComments.matchRejected,
      (state, action) => {
        state.lastCommentsError =
          action.error?.message || "Failed to load comments";
      },
    );
    builder.addMatcher(
      ticketCommentsApi.endpoints.listTicketComments.matchFulfilled,
      (state) => {
        state.lastCommentsError = null;
      },
    );
  },
});

export const ticketCommentsActions = ticketCommentsSlice.actions;
export const ticketCommentsReducer = ticketCommentsSlice.reducer;
