import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "./authCookies";
import type {
  AssignTicketRequest,
  AssignTicketResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketResponse,
  ListTicketsQuery,
  ListTicketsResponse,
  ListAssigneeTicketsResponse,
  ListRequesterTicketsResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from "../../models/ticket";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
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
    listTickets: builder.query<ListTicketsResponse, ListTicketsQuery | undefined>({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
    }),
    getTicket: builder.query<GetTicketResponse, number>({
      query: (ticket_id) => ({
        url: `/${ticket_id}`,
        method: "GET",
      }),
    }),
    assignTicket: builder.mutation<AssignTicketResponse, AssignTicketRequest>({
      query: ({ ticket_id, assignee_id }) => ({
        url: `/${ticket_id}/assignee`,
        method: "PATCH",
        body: { assignee_id },
      }),
    }),
    updateTicket: builder.mutation<UpdateTicketResponse, UpdateTicketRequest>({
      query: ({ ticket_id, ...body }) => ({
        url: `/${ticket_id}`,
        method: "PATCH",
        body,
      }),
    }),
    createTicket: builder.mutation<CreateTicketResponse, CreateTicketRequest>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    listAssigneeTickets: builder.query<ListAssigneeTicketsResponse, string>({
      query: (assignee_id) => ({
        url: `/assignee/${assignee_id}`,
        method: "GET",
      }),
    }),
    listRequesterTickets: builder.query<ListRequesterTicketsResponse, string>({
      query: (requester_id) => ({
        url: `/requester/${requester_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useListTicketsQuery,
  useGetTicketQuery,
  useAssignTicketMutation,
  useUpdateTicketMutation,
  useCreateTicketMutation,
  useListAssigneeTicketsQuery,
  useListRequesterTicketsQuery,
} = ticketApi;
