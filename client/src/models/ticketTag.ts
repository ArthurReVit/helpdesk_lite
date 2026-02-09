export type TicketTag = {
  ticket_id: number;
  tag_id: number;
};

export type TicketTagItem = {
  id: number;
  name: string;
  created_at: string | null;
};

export type ListTicketTagsResponse = {
  tags: TicketTagItem[];
};

export type AddTicketTagRequest = {
  ticket_id: number;
  tag_id: number;
};

export type AddTicketTagResponse = {
  message: string;
};

export type RemoveTicketTagRequest = {
  ticket_id: number;
  tag_id: number;
};

export type RemoveTicketTagResponse = {
  message: string;
};
