import { createSlice } from "@reduxjs/toolkit";
import { tagApi } from "./tagApi";

type TagState = {
  lastListError: string | null;
};

const initialState: TagState = {
  lastListError: null,
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearTagErrors(state) {
      state.lastListError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(tagApi.endpoints.listTags.matchRejected, (state, action) => {
      state.lastListError = action.error?.message || "Failed to load tags";
    });
    builder.addMatcher(tagApi.endpoints.listTags.matchFulfilled, (state) => {
      state.lastListError = null;
    });
  },
});

export const tagActions = tagSlice.actions;
export const tagReducer = tagSlice.reducer;
