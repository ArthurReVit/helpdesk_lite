import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/app_state/hooks";
import { useListRequesterTicketsQuery } from "../../lib/app_state/ticketApi";
import { useListTicketTagsQuery } from "../../lib/app_state/ticketTagApi";
import type { TicketListItem } from "../../models/ticket";
import type { TicketTagItem } from "../../models/ticketTag";

type TicketCardProps = {
  ticket: TicketListItem;
  onOpen: (ticket: TicketListItem) => void;
};

const TicketCard = ({ ticket, onOpen }: TicketCardProps) => {
  const { data: tagsData } = useListTicketTagsQuery(ticket.id);
  const ticketTags = tagsData?.tags ?? [];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(ticket)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(ticket);
        }
      }}
    >
      <div>
        <strong>{ticket.title}</strong>
      </div>
      <div>{ticket.description}</div>
      <div>Status: {ticket.status}</div>
      <div>Priority: {ticket.priority}</div>
      <div>Due at: {ticket.due_at ?? "—"}</div>
      <div>Closed at: {ticket.closed_at ?? "—"}</div>
      <div>
        <div>Tags</div>
        {ticketTags.length === 0 ? (
          <div>No tags.</div>
        ) : (
          <ul>
            {ticketTags.map((tag: TicketTagItem) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const MyTickets = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const requesterId = user?.id ?? "";

  const { data, isFetching, isError } = useListRequesterTicketsQuery(
    requesterId,
    { skip: !requesterId },
  );

  const tickets = useMemo(() => data?.tickets ?? [], [data]);

  const handleOpen = (ticket: TicketListItem) => {
    navigate(`/ticket/${ticket.id}`, { state: { ticket } });
  };

  return (
    <div>
      <h1>My Tickets</h1>
      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load tickets.</div> : null}
      {tickets.length === 0 ? (
        <div>No tickets found.</div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onOpen={handleOpen} />
        ))
      )}
    </div>
  );
};

export default MyTickets;
