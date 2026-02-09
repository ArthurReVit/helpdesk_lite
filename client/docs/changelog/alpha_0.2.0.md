# Alpha 0.2.0 - Layout, User Management & Account Profile

## Features

- **Nested Routing & Layout**:
  - Created a `Layout` component to provide a consistent UI (Header, Nav, Sidebar) for protected routes.
  - Implemented nested routing in `App.tsx` for `Dashboard`, `AddUser`, `UsersList`, and `Account`.
- **Advanced User Management**:
  - **Add User**: Admins can now register new users (Requester, Agent, or Admin).
  - **Enhanced Users List**:
    - Implemented client-side search by name.
    - Added multi-column sorting (Full Name, Email, Role, Active status).
    - Integrated pagination using `react-paginate`.
    - Added lifecycle actions (Activate/Deactivate and Delete) directly in the table.
- **Account Management**:
  - Created a new `Account` module for users to view their profile details.
  - Implemented a "Change Password" feature with RTK Query mutations and feedback notifications.
- **Auth & Global UI**:
  - Global "Log out" button in the header.
  - Consistent loading and error states for all user operations.

## Technical Changes

- **React 18 Optimization**: Refactored `UsersList` to avoid cascading renders by moving state resets to event handlers.
- **Model Extensions**: Updated `user.ts` types to support password changes, activation toggles, and user deletion.
- **API Improvements**: Expanded `userApi` with `deleteUser`, `setUserActive`, and `changePassword` mutations.

## TODOs

- **[ ] Server-Driven Session**:
  - Implement refresh tokens or session cookies.
  - _Idle Timer_: Implement a client-side inactivity timer.
