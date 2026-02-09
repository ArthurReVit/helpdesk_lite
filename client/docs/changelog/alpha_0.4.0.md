# Alpha 0.4.0 - Ticket Deep Dive & Tag Management

## Features

- **Ticket Detail View**:
  - Deep-dive page for individual tickets, providing a comprehensive view of all metadata and history.
  - **Unified Activity Feed**: Combines automated `TicketEvents` (audit trail) and `TicketComments` (conversations) into a single, chronologically ordered log.
- **Enhanced Collaboration**:
  - **Integrated Commenting**: Staff and requesters can now communicate directly within the ticket.
  - **Internal Notes**: Agents and admins can leave private comments hidden from the requester for internal staff coordination.
- **Advanced Tagging System**:
  - **Centralized Management**: New `TagList` module for admins and agents to maintain the global tag library (CRUD operations).
  - **Contextual Tagging**: Capability to add or remove tags directly from the main ticket lists without leaving the page.
- **Navigation & UX**:
  - Direct navigation from `Tickets`, `My Tickets`, and `Agent Tickets` to the specialized `TicketDetail` view.
  - Dynamic sidebar updates showing "Tags List" and "Ticket Detail" based on user roles.

## Technical Changes

- **Core API Expansion**:
  - Implemented `tagApi` for global tag operations.
  - Implemented `ticketTagApi` for managing the many-to-many relationship between tickets and tags.
  - Implemented `ticketCommentsApi` for full-featured conversation handling.
- **State & Data Invalidation**:
  - Leveraged RTK Query's automated cache invalidation to ensure tag lists and comment feeds refresh instantly upon updates.
- **Role-Based Logic**:
  - Strengthened client-side guards to restrict internal comment viewing and tag management to authorized staff roles.

## TODOs

- **[ ] Rich-Text Comments**: Support markdown or basic formatting in ticket comments.
- **[ ] Mentions**: Allow tagging staff members in internal notes to trigger notifications.
