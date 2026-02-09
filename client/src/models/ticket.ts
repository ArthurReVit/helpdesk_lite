export type TicketStatus =
  | "open"
  | "triaged"
  | "in_progress"
  | "waiting_on_requester"
  | "resolved"
  | "closed"
  | "canceled";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Ticket = {
  id: number;
  requester_id: string;
  assignee_id: string | null;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  due_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TicketListItem = {
  id: number;
  requester_id: string | null;
  assignee_id: string | null;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  due_at?: string | null;
  closed_at?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TicketSortDirection = "asc" | "desc";
export type TicketSortBy =
  | "created_at"
  | "updated_at"
  | "title"
  | "status"
  | "priority"
  | "id";

export type ListTicketsQuery = {
  sort?: TicketSortDirection;
  sort_by?: TicketSortBy;
  limit?: number;
};

export type ListTicketsResponse = {
  tickets: TicketListItem[];
};

export type ListAssigneeTicketsResponse = {
  tickets: TicketListItem[];
};

export type ListRequesterTicketsResponse = {
  tickets: TicketListItem[];
};

export type GetTicketResponse = {
  ticket: Ticket;
};

export type AssignTicketRequest = {
  ticket_id: number;
  assignee_id: string;
};

export type AssignTicketResponse = {
  message: string;
};

export type UpdateTicketRequest = {
  ticket_id: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  due_at?: string | null;
};

export type UpdateTicketResponse = {
  message: string;
};

export type CreateTicketRequest = {
  title: string;
  description: string;
  priority?: TicketPriority;
};

export type CreateTicketResponse = {
  message: string;
  id: number;
};
