# Alpha 0.5.0

## Changes

- Created the `Ticket` model with support for status, priority, and relationships.
- Implemented and documented the following ticket endpoints:
  - `POST /api/tickets/`: Create a new ticket.
  - `GET /api/tickets/`: List all tickets (Admin only, supports sorting/limiting).
  - `GET /api/tickets/requester/<requester_id>`: List tickets created by the user.
  - `GET /api/tickets/assignee/<assignee_id>`: List tickets assigned to the agent.
  - `GET /api/tickets/<ticket_id>`: Get ticket details (Admin only).
  - `PATCH /api/tickets/<ticket_id>`: Update ticket status, priority, or due date (Admin/Agent).
  - `PATCH /api/tickets/<ticket_id>/assignee`: Assign an agent to a ticket (Admin only).
- Implemented and documented ticket tag management:
  - `GET /api/tickets/<ticket_id>/tags`: List tags for a ticket.
  - `POST /api/tickets/<ticket_id>/tags`: Add a tag to a ticket (Admin/Agent).
  - `DELETE /api/tickets/<ticket_id>/tags`: Remove a tag from a ticket (Admin/Agent).
- Documented the tickets and ticket tags modules in the [Tickets API Documentation](../api/tickets.md).
- Created Swagger specifications for the ticket management and ticket tag modules under `docs/swagger/`.
- Integrated the Swagger documentation with the API using `swag_from`.

## Bug fixes

- No bugs identified at the moment.

## Notes

- All admin endpoints for tickets require the `admin` role.
- Tickets are created with a default status of `open` and priority of `medium`.
