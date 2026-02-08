# Alpha 0.6.0

## Changes

- Implemented and documented ticket comment management:
  - `GET /api/tickets/<ticket_id>/comments`: List comments for a ticket (respecting visibility rules).
  - `POST /api/tickets/<ticket_id>/comments`: Add a comment to a ticket (supports internal comments).
- Implemented a comprehensive automatic ticket event logging system:
  - Ticket creation (`ticket_created`).
  - Status changes (`status_changed`).
  - Priority changes (`priority_changed`).
  - Assignee changes (`assignee_changed`).
  - Tag additions (`tag_added`) and removals (`tag_removed`).
  - Comment additions (`comment_added`).
- Documented the ticket comments module and event side effects in the [Tickets API Documentation](../api/tickets.md).
- Created Swagger specifications for the ticket comment module and updated existing ones with event logging details.
- Extended the `swag_from` integration for all new endpoints.

## Bug fixes

- Noted behavior logic for internal comments to ensure agents can only see/create them on their assigned tickets.

## Notes

- The event logging system provides a full audit trail of ticket life-cycle changes.
- Comment visibility varies by role: Requesters only see public comments; Admins/Agents see internal ones.
