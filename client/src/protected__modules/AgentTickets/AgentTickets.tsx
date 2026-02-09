import { useMemo, useState } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import {
  useListAssigneeTicketsQuery,
  useUpdateTicketMutation,
} from "../../lib/app_state/ticketApi";
import type {
  TicketListItem,
  TicketPriority,
  TicketStatus,
} from "../../models/ticket";

type TicketCardProps = {
  ticket: TicketListItem;
  onUpdate: (ticketId: number, payload: UpdateTicketPayload) => void;
  isBusy: boolean;
};

type UpdateTicketPayload = {
  status?: TicketStatus;
  priority?: TicketPriority;
  due_at?: string | null;
};

const STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "triaged",
  "in_progress",
  "waiting_on_requester",
  "resolved",
  "closed",
  "canceled",
];
const PRIORITY_OPTIONS: TicketPriority[] = ["low", "medium", "high", "urgent"];

const TicketCard = ({ ticket, onUpdate, isBusy }: TicketCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [dueAt, setDueAt] = useState("");

  const handleUpdate = () => {
    const payload: UpdateTicketPayload = {};
    if (status) {
      payload.status = status;
    }
    if (priority) {
      payload.priority = priority;
    }
    if (dueAt) {
      payload.due_at = dueAt;
    }
    onUpdate(ticket.id, payload);
    setShowEdit(false);
    setStatus("");
    setPriority("");
    setDueAt("");
  };

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
      <div>
        <button type="button" onClick={() => setShowEdit((prev) => !prev)}>
          Edit ticket
        </button>
        {showEdit ? (
          <div>
            <div>
              <label htmlFor={`status-${ticket.id}`}>Status</label>
              <select
                id={`status-${ticket.id}`}
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TicketStatus)
                }
              >
                <option value="">No change</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`priority-${ticket.id}`}>Priority</label>
              <select
                id={`priority-${ticket.id}`}
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TicketPriority)
                }
              >
                <option value="">No change</option>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`dueAt-${ticket.id}`}>Due at (ISO)</label>
              <input
                id={`dueAt-${ticket.id}`}
                type="text"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
              />
            </div>
            <button type="button" onClick={handleUpdate} disabled={isBusy}>
              Save
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AgentTickets = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAgent = user?.role === "agent";
  const assigneeId = user?.id ?? "";

  const { data, isFetching, isError } = useListAssigneeTicketsQuery(assigneeId, {
    skip: !isAgent,
  });
  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateTicketMutation();

  const tickets = useMemo(() => data?.tickets ?? [], [data]);

  const handleUpdate = async (ticketId: number, payload: UpdateTicketPayload) => {
    if (!payload.status && !payload.priority && payload.due_at === undefined) {
      return;
    }
    await updateTicket({ ticket_id: ticketId, ...payload });
  };

  if (!isAgent) {
    return <div>Agents only.</div>;
  }

  return (
    <div>
      <h1>Assigned Tickets</h1>
      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load tickets.</div> : null}
      {tickets.length === 0 ? (
        <div>No assigned tickets.</div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onUpdate={handleUpdate}
            isBusy={isUpdating}
          />
        ))
      )}
    </div>
  );
};

export default AgentTickets;
