import { useMemo, useState } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import {
  useAssignTicketMutation,
  useListTicketsQuery,
  useUpdateTicketMutation,
} from "../../lib/app_state/ticketApi";
import { useListUsersQuery } from "../../lib/app_state/userApi";
import type { User } from "../../models/user";
import type {
  TicketListItem,
  TicketSortBy,
  TicketSortDirection,
  TicketStatus,
  TicketPriority,
} from "../../models/ticket";

const SORT_BY_OPTIONS: TicketSortBy[] = [
  "created_at",
  "updated_at",
  "title",
  "status",
  "priority",
  "id",
];
const SORT_DIR_OPTIONS: TicketSortDirection[] = ["asc", "desc"];
const LIMIT_OPTIONS = [5, 10, 15, 20];
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

type TicketCardProps = {
  ticket: TicketListItem;
  agents: User[];
  onAssign: (ticketId: number, assigneeId: string) => void;
  onUpdate: (ticketId: number, payload: UpdateTicketPayload) => void;
  isBusy: boolean;
};

type UpdateTicketPayload = {
  status?: TicketStatus;
  priority?: TicketPriority;
  due_at?: string | null;
};

const TicketCard = ({
  ticket,
  agents,
  onAssign,
  onUpdate,
  isBusy,
}: TicketCardProps) => {
  const [assigneeId, setAssigneeId] = useState(ticket.assignee_id ?? "");
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [dueAt, setDueAt] = useState("");

  const handleAssign = () => {
    if (!assigneeId) {
      return;
    }
    onAssign(ticket.id, assigneeId);
  };

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
        <label htmlFor={`assignee-${ticket.id}`}>Assign agent</label>
        <select
          id={`assignee-${ticket.id}`}
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
        >
          <option value="">Select agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.full_name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAssign} disabled={isBusy}>
          Assign
        </button>
      </div>
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

const Tickets = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<TicketSortBy>("created_at");
  const [sortDir, setSortDir] = useState<TicketSortDirection>("desc");
  const [limit, setLimit] = useState<number | undefined>(20);

  const { data, isFetching, isError } = useListTicketsQuery(
    isAdmin
      ? {
          sort_by: sortBy,
          sort: sortDir,
          limit,
        }
      : undefined,
    { skip: !isAdmin },
  );
  const { data: usersData } = useListUsersQuery(
    isAdmin ? { sort_by: "full_name", sort: "asc" } : undefined,
    { skip: !isAdmin },
  );
  const [assignTicket, { isLoading: isAssigning }] =
    useAssignTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateTicketMutation();

  const filteredTickets = useMemo(() => {
    const tickets = data?.tickets ?? [];
    const term = search.trim().toLowerCase();
    if (!term) {
      return tickets;
    }
    return tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term),
    );
  }, [data, search]);

  const agents = useMemo(() => {
    const users = usersData?.users ?? [];
    return users.filter((user) => user.role === "agent");
  }, [usersData]);

  const handleAssign = async (ticketId: number, assigneeId: string) => {
    await assignTicket({ ticket_id: ticketId, assignee_id: assigneeId });
  };

  const handleUpdate = async (ticketId: number, payload: UpdateTicketPayload) => {
    if (!payload.status && !payload.priority && payload.due_at === undefined) {
      return;
    }
    await updateTicket({ ticket_id: ticketId, ...payload });
  };

  if (!isAdmin) {
    return <div>Admins only.</div>;
  }

  return (
    <div>
      <h1>Tickets</h1>

      <div>
        <label htmlFor="ticketSearch">Search</label>
        <input
          id="ticketSearch"
          name="ticketSearch"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as TicketSortBy)}
        >
          {SORT_BY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="sortDir">Sort direction</label>
        <select
          id="sortDir"
          name="sortDir"
          value={sortDir}
          onChange={(event) =>
            setSortDir(event.target.value as TicketSortDirection)
          }
        >
          {SORT_DIR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="limit">Limit</label>
        <select
          id="limit"
          name="limit"
          value={limit}
          onChange={(event) => {
            const value = Number(event.target.value);
            setLimit(Number.isNaN(value) ? undefined : value);
          }}
        >
          {LIMIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load tickets.</div> : null}

      <div>
        {filteredTickets.length === 0 ? (
          <div>No tickets found.</div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              agents={agents}
              onAssign={handleAssign}
              onUpdate={handleUpdate}
              isBusy={isAssigning || isUpdating}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tickets;
