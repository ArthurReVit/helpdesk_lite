import { useMemo } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import { useListRequesterTicketsQuery } from "../../lib/app_state/ticketApi";
import type { TicketListItem } from "../../models/ticket";

type TicketCardProps = {
  ticket: TicketListItem;
};

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div>
      <div>
        <strong>{ticket.title}</strong>
      </div>
      <div>{ticket.description}</div>
      <div>Status: {ticket.status}</div>
      <div>Priority: {ticket.priority}</div>
      <div>Due at: {ticket.due_at ?? "—"}</div>
      <div>Closed at: {ticket.closed_at ?? "—"}</div>
    </div>
  );
};

const MyTickets = () => {
  const user = useAppSelector((state) => state.auth.user);
  const requesterId = user?.id ?? "";

  const { data, isFetching, isError } = useListRequesterTicketsQuery(
    requesterId,
    { skip: !requesterId },
  );

  const tickets = useMemo(() => data?.tickets ?? [], [data]);

  return (
    <div>
      <h1>My Tickets</h1>
      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load tickets.</div> : null}
      {tickets.length === 0 ? (
        <div>No tickets found.</div>
      ) : (
        tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );
};

export default MyTickets;
