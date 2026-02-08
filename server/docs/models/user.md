## User

The model's columns and their descriptions:

- id: Unique user identifier (UUID)
- full_name: User's full name
- email: Login identifier (unique)
- role: Determines access level
- password_hash: Hashed password for authentication
- is_active: Soft-disable flag for accounts
- created_at: Timestamp of creation
- updated_at: Timestamp of last update

The model's relationships:

- requested_tickets: Tickets created by the user
- assigned_tickets: Tickets assigned to the user
- comments: Comments made by the user
- events: Events triggered by the user

Quick access list:

- [User](./user.md) (You're here)
- [Tag](./tag.md)
- [Ticket](./ticket.md)
- [TicketComment](./ticket_comment.md)
- [TicketEvent](./ticket_event.md)
- [TicketTag](./ticket_tag.md)
