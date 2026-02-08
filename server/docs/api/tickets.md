## Tickets Endpoints

The following endpoints are available for ticket management:

- POST /api/tickets/:

Allows an authenticated user to create a new support ticket.

- **Requirements**:
  - Authenticated user (JWT required).
  - `title` and `description` fields in the JSON body.
- **Optional**:
  - `priority`: One of `low`, `medium`, `high`, `urgent`. Default: `medium`.

- GET /api/tickets/:

Allows an admin to retrieve a list of all tickets in the system.

- **Query Parameters**:
  - `sort_by`: Field to sort by (`created_at`, `updated_at`, `title`, `status`, `priority`, `id`). Default: `created_at`.
  - `sort`: Sort direction (`asc` or `desc`). Default: `desc`.
  - `limit`: Integer. Limit the number of results.

- GET /api/tickets/requester/<requester_id>:

Allows an authenticated user to retrieve a list of tickets they have created.

- **Constraints**: Users can only view their own tickets.

- GET /api/tickets/assignee/<assignee_id>:

Allows an agent to retrieve a list of tickets assigned to them.

- **Constraints**: Agents can only view their own assigned tickets.

- GET /api/tickets/<ticket_id>:

Allows an admin to retrieve the details of a specific ticket by its ID.

- PATCH /api/tickets/<ticket_id>:

Allows an admin or an agent to partially update a ticket.

- **Requirements**:
  - Admin or Agent privileges (JWT required).
  - At least one of: `status`, `priority`, `due_at` in the JSON body.
- **Allowed Values**:
  - `status`: `open`, `triaged`, `in_progress`, `waiting_on_requester`, `resolved`, `closed`, `canceled`.
  - `priority`: `low`, `medium`, `high`, `urgent`.
  - `due_at`: ISO 8601 string or `null`.

- PATCH /api/tickets/<ticket_id>/assignee:

Allows an admin to assign an agent to a ticket.

- **Requirements**:
  - Admin privileges (JWT required).
  - `assignee_id` field in the JSON body (must be a UUID of a user with role `agent`).

### Ticket Tag Management

- GET /api/tickets/<ticket_id>/tags:

Retrieves a list of all tags currently assigned to a specific ticket.

- POST /api/tickets/<ticket_id>/tags:

Allows an admin or agent to assign a tag to a ticket.

- **Requirements**:
  - Admin or Agent privileges (JWT required).
  - `tag_id` (integer) in the JSON body.
- **Constraints**:
  - Tag must not be already assigned to the ticket.

- DELETE /api/tickets/<ticket_id>/tags:

Allows an admin or agent to remove a tag from a ticket.

- **Requirements**:
  - Admin or Agent privileges (JWT required).
  - `tag_id` (integer) in the JSON body.

You can refer to the ([Swagger](http://localhost:5000/apidocs)) for more information.
