import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "./authCookies";
import type {
  CreateTicketCommentRequest,
  CreateTicketCommentResponse,
  ListTicketCommentsResponse,
} from "../../models/ticketComment";

export const ticketCommentsApi = createApi({
  reducerPath: "ticketCommentsApi",
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
    listTicketComments: builder.query<ListTicketCommentsResponse, number>({
      query: (ticket_id) => ({
        url: `/${ticket_id}/comments`,
        method: "GET",
      }),
    }),
    createTicketComment: builder.mutation<
      CreateTicketCommentResponse,
      CreateTicketCommentRequest
    >({
      query: ({ ticket_id, ...body }) => ({
        url: `/${ticket_id}/comments`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useListTicketCommentsQuery,
  useCreateTicketCommentMutation,
} = ticketCommentsApi;
