## TicketEvent

The model's columns and their descriptions:

- id: Primary key
- ticket_id: Foreign key to the ticket
- author_id: Foreign key to the user
- event_type: Type of event
- body: Event body
- created_at: Timestamp of creation
- updated_at: Timestamp of last update

The model's relationships:

- ticket: Ticket associated with the event
- actor: User who made the event

### Quick access list:

- [User](./user.md)
- [Ticket](./ticket.md)
- [TicketComment](./ticket_comment.md)
- [TicketEvent](./ticket_event.md) (You're here)
- [TicketTag](./ticket_tag.md)
- [Tag](./tag.md)
