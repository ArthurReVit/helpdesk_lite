# Alpha 0.3.0 - Helpdesk Ticket System

## Features

- **End-to-End Ticket Management**:
  - **Ticket Creation**: Requesters can now submit support tickets with a title, description, and priority.
  - **Dynamic Ticket Lists**:
    - **General List**: Admins can view and sort all system tickets.
    - **My Tickets**: Personalized view for requesters to track their active requests.
    - **Agent View**: Specialized list for agents to focus on their assigned tickets.
  - **Workflow Controls**: Support for status transitions (Open → Triaged → In Progress → Resolved → Closed) and priority adjustments.
  - **Ticket Assignment**: Admins can assign tickets to specific agents to manage the helpdesk load.

- **Collaboration & Audit Tools**:
  - **Commenting System**: Added support for ticket conversations.
    - _Internal Notes_: Agents and admins can add private internal comments visible only to staff.
  - **Event Tracking (Audit Log)**: Every major action (status change, assignment, new comment) is automatically logged as a `TicketEvent` for full traceability.
  - **Tagging Support**: Backend infrastructure for categorizing tickets with tags.

- **Security & Authorization**:
  - **Role-Based Access Control (RBAC)**: Strengthened security to ensure users can only access tickets they own or are assigned to.
  - **Admin Overrides**: Administrators maintain full visibility and control across all system modules.

## Technical Changes

- **Server-Side Architecture**:
  - Implemented `tickets`, `ticket_comments`, and `tags` API blueprints in Flask.
  - Expanded the database schema with `Ticket`, `TicketComment`, `TicketEvent`, and `Tag` models.
  - Integrated `flasgger` (Swagger) documentation for all new endpoints.
- **Client-Side Improvements**:
  - Established `ticketApi` using RTK Query for efficient data fetching and cache management.
  - Added `ticketSlice` for handling global ticket-related UI state and error reporting.
  - Implemented new protected modules: `CreateTicket`, `MyTickets`, `AgentTickets`, and `Tickets`.

## TODOs

- **[ ] Real-time Notifications**: Notify users when their ticket status changes or a comment is added.
- **[ ] File Attachments**: Allow users to upload screenshots or logs to tickets/comments.
