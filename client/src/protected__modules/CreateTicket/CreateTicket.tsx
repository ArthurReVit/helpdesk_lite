import { type SubmitEvent, useState } from "react";
import { useCreateTicketMutation } from "../../lib/app_state/ticketApi";
import type { TicketPriority } from "../../models/ticket";

const PRIORITY_OPTIONS: TicketPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [createTicket, { isLoading, isSuccess, isError, error }] =
    useCreateTicketMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createTicket({ title, description, priority }).unwrap();
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch {
      // Mutation state handles errors.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TicketPriority)}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading}>
        Create ticket
      </button>
      {isSuccess ? <div>Ticket created.</div> : null}
      {isError ? (
        <div>
          {typeof error === "object" && error && "status" in error
            ? `Ticket creation failed (${error.status})`
            : "Ticket creation failed"}
        </div>
      ) : null}
    </form>
  );
};

export default CreateTicket;
