export type TicketComment = {
  id: number;
  ticket_id: number;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string | null;
};

export type ListTicketCommentsResponse = {
  comments: TicketComment[];
};

export type CreateTicketCommentRequest = {
  ticket_id: number;
  body: string;
  is_internal?: boolean;
};

export type CreateTicketCommentResponse = {
  message: string;
  id: number;
};
