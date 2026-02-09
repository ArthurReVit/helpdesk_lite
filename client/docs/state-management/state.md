# State Management

## Redux Store

The application uses **Redux Toolkit** for centralized state management. The store is configured in `src/lib/app_state/store.ts`.

## RTK Query (Data Fetching)

We use **RTK Query** for efficient data fetching, caching, and cache invalidation.

### Auth API (`authApi.ts`)

- **Endpoints**:
  - `login`: Mutation for user authentication.
  - `me`: Query to fetch current user profile.
- **Base URL**: `/api/auth`.
- **Headers**: Automatically injects the Bearer token from cookies.

### User API (`userApi.ts`)

- **Endpoints**:
  - `registerUser`: Create new users (admin only).
  - `listUsers`: Searchable and sortable user list.
  - `deleteUser`: Permanently remove a user record.
  - `setUserActive`: Toggle account status (Active/Deactivated).
  - `changePassword`: Mutation for users to update their own credentials.
- **Base URL**: `/api/users`.

### Ticket API (`ticketApi.ts`)

- **Endpoints**:
  - `createTicket`: Submit a new support request.
  - `listTickets`: Admin list of all system tickets.
  - `listMyTickets`: Requesters' view of their own tickets.
  - `listAgentTickets`: Agents' view of assigned work.
  - `assignTicket`: Link a ticket to an agent.
  - `updateTicket`: Modify status (e.g., Resolve) or priority.
- **Base URL**: `/api/tickets`.

## Slices

- **Auth Slice (`authSlice.ts`)**: Manages local authentication state and the current user profile.
- **Ticket Slice (`ticketSlice.ts`)**: Handles global ticket UI states and centralized error messaging for ticket lists.
- **User Slice (`userSlice.ts`)**: Manages temporary states for user management workflows.

## Persistence

Authentication tokens are persisted using high-security cookies via `src/lib/app_state/authCookies.ts`. This allows session persistence across page refreshes while the `me` query handles re-authentication.
