# Alpha 0.7.0

## Changes

- Implemented and documented a new audit trail endpoint:
  - `GET /api/tickets/<ticket_id>/events`: Allows authorized users to view the complete history of a ticket.
- Enhanced event visibility logic:
  - Ensured Requesters can view the audit trail of their own tickets while maintaining confidentiality of internal staff actions (e.g., internal comments).
- Documented the Ticket Event History module in the [Tickets API Documentation](../api/tickets.md).
- Integrated Swagger specifications for the ticket events retrieval endpoint.

## Notes

- The audit trail includes all lifecycle events such as creation, status changes, priority shifts, assignments, tagging, and comments.
- Access to the event history is restricted to those with a direct relationship to the ticket (Requester, Agent, or Admin).
