# State Management

## Redux Store

The application uses **Redux Toolkit** for centralized state management. The store is configured in `src/lib/app_state/store.ts`.

## RTK Query (Data Fetching)

We use **RTK Query** for efficient data fetching and caching.

### Auth API (`authApi.ts`)

- **Endpoints**:
  - `login`: Mutation for user authentication.
  - `me`: Query to fetch current user profile.
- **Base URL**: Configured via environment variables (usually `/api/auth`).
- **Headers**: Automatically injects the Bearer token from cookies/local storage.

## Slices

- **Auth Slice (`authSlice.ts`)**: Manages local authentication state, such as the current user object and session status.

## Persistence

Authentication tokens are persisted using cookies/local storage via `src/lib/app_state/authCookies.ts`.
