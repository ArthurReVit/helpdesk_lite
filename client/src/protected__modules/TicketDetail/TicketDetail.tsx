import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import { useListTicketEventsQuery } from "../../lib/app_state/ticketApi";
import {
  useCreateTicketCommentMutation,
  useListTicketCommentsQuery,
} from "../../lib/app_state/ticketCommentsApi";
import type { TicketEvent, TicketListItem } from "../../models/ticket";
import type { TicketComment } from "../../models/ticketComment";

type LocationState = {
  ticket?: TicketListItem;
};

const TicketDetail = () => {
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const state = location.state as LocationState | null;
  const ticket = state?.ticket;
  const ticketId = id ? Number(id) : NaN;
  const skipQueries = !ticketId || Number.isNaN(ticketId);
  const { data: eventsData } = useListTicketEventsQuery(ticketId, {
    skip: skipQueries,
  });
  const { data: commentsData } = useListTicketCommentsQuery(ticketId, {
    skip: skipQueries,
  });
  const [createTicketComment, createTicketCommentState] =
    useCreateTicketCommentMutation();
  const [commentBody, setCommentBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const eventLogItems = useMemo(() => {
    const eventItems = (eventsData?.events ?? []).map((event) => ({
      key: `event-${event.id}`,
      created_at: event.created_at,
      type: "event" as const,
      event,
    }));
    const commentItems = (commentsData?.comments ?? []).map((comment) => ({
      key: `comment-${comment.id}`,
      created_at: comment.created_at,
      type: "comment" as const,
      comment,
    }));
    return [...eventItems, ...commentItems].sort((a, b) => {
      const aTime = a.created_at
        ? Date.parse(a.created_at)
        : Number.POSITIVE_INFINITY;
      const bTime = b.created_at
        ? Date.parse(b.created_at)
        : Number.POSITIVE_INFINITY;
      return aTime - bTime;
    });
  }, [eventsData?.events, commentsData?.comments]);

  if (!ticket) {
    return <div>Ticket data not available.</div>;
  }

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";
  const isRequester = user?.role === "requester";
  const isAssignee = ticket.assignee_id === user?.id;
  const isTicketRequester = ticket.requester_id === user?.id;

  const canView =
    isAdmin || (isAgent && (isAssignee || isTicketRequester)) || (isRequester && isTicketRequester);

  if (!canView) {
    return <div>Access denied.</div>;
  }

  const canAddInternal = isAdmin || isAssignee;
  const canSubmitComment = commentBody.trim().length > 0;

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmitComment || skipQueries) {
      return;
    }
    try {
      await createTicketComment({
        ticket_id: ticketId,
        body: commentBody.trim(),
        is_internal: canAddInternal ? isInternal : undefined,
      }).unwrap();
      setCommentBody("");
      setIsInternal(false);
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <div>
      <h1>Ticket {id}</h1>
      <div>
        <strong>{ticket.title}</strong>
      </div>
      <div>{ticket.description}</div>
      <div>Status: {ticket.status}</div>
      <div>Priority: {ticket.priority}</div>
      <div>Due at: {ticket.due_at ?? "--"}</div>
      <div>Closed at: {ticket.closed_at ?? "--"}</div>
      <div>Requester: {ticket.requester_id}</div>
      <div>Assignee: {ticket.assignee_id ?? "--"}</div>
      <div>Created at: {ticket.created_at ?? "--"}</div>
      <div>Updated at: {ticket.updated_at ?? "--"}</div>
      <div style={{ marginTop: "24px" }}>
        <h2>Event Log</h2>
        <form onSubmit={handleSubmitComment} style={{ marginBottom: "16px" }}>
          <div>
            <label htmlFor="ticket-comment-body">
              <strong>Add Comment</strong>
            </label>
          </div>
          <div>
            <textarea
              id="ticket-comment-body"
              rows={4}
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              style={{ width: "100%", maxWidth: "640px" }}
              placeholder="Write a comment..."
            />
          </div>
          {canAddInternal ? (
            <label style={{ display: "block", marginTop: "8px" }}>
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(event) => setIsInternal(event.target.checked)}
              />{" "}
              Internal comment
            </label>
          ) : null}
          <button
            type="submit"
            disabled={
              !canSubmitComment ||
              createTicketCommentState.isLoading ||
              skipQueries
            }
            style={{ marginTop: "8px" }}
          >
            {createTicketCommentState.isLoading ? "Posting..." : "Post Comment"}
          </button>
          {createTicketCommentState.isError ? (
            <div style={{ marginTop: "8px" }}>
              Failed to post comment.
            </div>
          ) : null}
        </form>
        {eventLogItems.length === 0 ? (
          <div>No events or comments yet.</div>
        ) : (
          eventLogItems.map((item) => {
            if (item.type === "comment") {
              const comment = item.comment as TicketComment;
              return (
                <div key={item.key} style={{ marginBottom: "12px" }}>
                  <div>
                    <strong>Comment</strong>{" "}
                    <span>{comment.created_at ?? "--"}</span>
                  </div>
                  <div>Author: {comment.author_id}</div>
                  <div>{comment.body}</div>
                  {comment.is_internal ? <div>Internal</div> : null}
                </div>
              );
            }

            const event = item.event as TicketEvent;
            return (
              <div key={item.key} style={{ marginBottom: "12px" }}>
                <div>
                  <strong>Event</strong>{" "}
                  <span>{event.created_at ?? "--"}</span>
                </div>
                <div>Type: {event.event_type}</div>
                <div>Actor: {event.actor_id ?? "--"}</div>
                <div>Meta:</div>
                <pre>{JSON.stringify(event.meta ?? {}, null, 2)}</pre>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
