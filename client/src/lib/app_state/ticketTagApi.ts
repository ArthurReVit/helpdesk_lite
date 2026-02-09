import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "./authCookies";
import type {
  AddTicketTagRequest,
  AddTicketTagResponse,
  ListTicketTagsResponse,
  RemoveTicketTagRequest,
  RemoveTicketTagResponse,
} from "../../models/ticketTag";

export const ticketTagApi = createApi({
  reducerPath: "ticketTagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/tickets`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    listTicketTags: builder.query<ListTicketTagsResponse, number>({
      query: (ticket_id) => ({
        url: `/${ticket_id}/tags`,
        method: "GET",
      }),
    }),
    addTicketTag: builder.mutation<AddTicketTagResponse, AddTicketTagRequest>({
      query: ({ ticket_id, tag_id }) => ({
        url: `/${ticket_id}/tags`,
        method: "POST",
        body: { tag_id },
      }),
    }),
    removeTicketTag: builder.mutation<
      RemoveTicketTagResponse,
      RemoveTicketTagRequest
    >({
      query: ({ ticket_id, tag_id }) => ({
        url: `/${ticket_id}/tags`,
        method: "DELETE",
        body: { tag_id },
      }),
    }),
  }),
});

export const {
  useListTicketTagsQuery,
  useAddTicketTagMutation,
  useRemoveTicketTagMutation,
} = ticketTagApi;
