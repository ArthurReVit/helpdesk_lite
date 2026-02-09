import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/app_state/hooks";
import {
  useListAssigneeTicketsQuery,
  useUpdateTicketMutation,
} from "../../lib/app_state/ticketApi";
import {
  useAddTicketTagMutation,
  useListTicketTagsQuery,
  useRemoveTicketTagMutation,
} from "../../lib/app_state/ticketTagApi";
import { useListTagsQuery } from "../../lib/app_state/tagApi";
import type {
  TicketListItem,
  TicketPriority,
  TicketStatus,
} from "../../models/ticket";
import type { Tag } from "../../models/tag";
import type { TicketTagItem } from "../../models/ticketTag";

type TicketCardProps = {
  ticket: TicketListItem;
  onUpdate: (ticketId: number, payload: UpdateTicketPayload) => void;
  onAddTag: (ticketId: number, tagId: number) => void;
  onRemoveTag: (ticketId: number, tagId: number) => void;
  onOpen: (ticket: TicketListItem) => void;
  allTags: Tag[];
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

const TicketCard = ({
  ticket,
  onUpdate,
  onAddTag,
  onRemoveTag,
  onOpen,
  allTags,
  isBusy,
}: TicketCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [dueAt, setDueAt] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");

  const { data: tagsData } = useListTicketTagsQuery(ticket.id);
  const ticketTags = tagsData?.tags ?? [];

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

  const handleAddTag = () => {
    const tagId = Number(selectedTagId);
    if (!tagId) {
      return;
    }
    onAddTag(ticket.id, tagId);
    setSelectedTagId("");
  };

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
      <div onClick={(event) => event.stopPropagation()}>
        <div>Tags</div>
        {ticketTags.length === 0 ? (
          <div>No tags.</div>
        ) : (
          <ul>
            {ticketTags.map((tag: TicketTagItem) => (
              <li key={tag.id}>
                {tag.name}
                <button
                  type="button"
                  onClick={() => onRemoveTag(ticket.id, tag.id)}
                  disabled={isBusy}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div onClick={(event) => event.stopPropagation()}>
          <select
            value={selectedTagId}
            onChange={(event) => setSelectedTagId(event.target.value)}
          >
            <option value="">Select tag</option>
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddTag} disabled={isBusy}>
            Add tag
          </button>
        </div>
      </div>
      <div onClick={(event) => event.stopPropagation()}>
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
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAgent = user?.role === "agent";
  const assigneeId = user?.id ?? "";

  const { data, isFetching, isError } = useListAssigneeTicketsQuery(assigneeId, {
    skip: !isAgent,
  });
  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateTicketMutation();
  const { data: tagsData } = useListTagsQuery(
    isAgent ? { sort_by: "name", sort: "asc" } : undefined,
    { skip: !isAgent },
  );
  const [addTicketTag, { isLoading: isAddingTag }] = useAddTicketTagMutation();
  const [removeTicketTag, { isLoading: isRemovingTag }] =
    useRemoveTicketTagMutation();

  const tickets = useMemo(() => data?.tickets ?? [], [data]);
  const allTags = useMemo(() => tagsData?.tags ?? [], [tagsData]);

  const handleUpdate = async (ticketId: number, payload: UpdateTicketPayload) => {
    if (!payload.status && !payload.priority && payload.due_at === undefined) {
      return;
    }
    await updateTicket({ ticket_id: ticketId, ...payload });
  };

  const handleAddTag = async (ticketId: number, tagId: number) => {
    await addTicketTag({ ticket_id: ticketId, tag_id: tagId });
  };

  const handleRemoveTag = async (ticketId: number, tagId: number) => {
    await removeTicketTag({ ticket_id: ticketId, tag_id: tagId });
  };

  const handleOpen = (ticket: TicketListItem) => {
    navigate(`/ticket/${ticket.id}`, { state: { ticket } });
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
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onOpen={handleOpen}
            allTags={allTags}
            isBusy={isUpdating || isAddingTag || isRemovingTag}
          />
        ))
      )}
    </div>
  );
};

export default AgentTickets;
