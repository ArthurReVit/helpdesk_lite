## TicketComment

The model's columns and their descriptions:

- id: Primary key
- ticket_id: Foreign key to the ticket
- author_id: Foreign key to the user
- body: Comment body
- is_internal: Whether the comment is internal
- created_at: Timestamp of creation
- updated_at: Timestamp of last update

The model's relationships:

- ticket: Ticket associated with the comment
- author: User who made the comment

### Quick access list:

- [User](./user.md)
- [Ticket](./ticket.md)
- [TicketComment](./ticket_comment.md) (You're here)
- [TicketEvent](./ticket_event.md)
- [TicketTag](./ticket_tag.md)
- [Tag](./tag.md)
