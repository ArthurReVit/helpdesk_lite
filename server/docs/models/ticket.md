## Ticket

The model's columns and their descriptions:

- id: Primary key
- requester_id: Foreign key to the user who created the ticket
- assignee_id: Foreign key to the user assigned to the ticket (optional)
- title: Ticket title
- description: Ticket description
- priority: Ticket priority (low, medium, high, urgent)
- status: Ticket status (open, triaged, in_progress, etc.)
- due_at: Timestamp for when the ticket is due
- resolved_at: Timestamp for when the ticket was resolved
- closed_at: Timestamp for when the ticket was closed
- created_at: Timestamp of creation
- updated_at: Timestamp of last update

The model's relationships:

- requester: User who created the ticket
- assignee: User assigned to the ticket
- comments: Comments associated with the ticket
- events: Events associated with the ticket
- tags: Tags associated with the ticket

### Quick access list:

- [User](user.md)
- [Ticket](ticket.md) (You're here)
- [TicketComment](ticket_comment.md)
- [TicketEvent](ticket_event.md)
- [TicketTag](ticket_tag.md)
- [Tag](tag.md)
