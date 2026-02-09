# Components and Modules

## Public Modules

### Login (`src/public_modules/Login/`)

- **Login.tsx**: The main login form component.
- **Functionality**:
  - Validates user credentials.
  - Interacts with `authApi` to perform login.
  - Redirects to Dashboard upon success.

## Protected Modules

### Dashboard (`src/protected__modules/Dashboard/`)

- **Dashboard.tsx**: The primary view for authenticated users.
- **Features**: Displays user-specific information and serves as the navigation hub.

### Add User (`src/protected__modules/AddUser/`)

- **AddUser.tsx**: Form for administrators to create new users.
- **Functionality**:
  - Collects full name, email, password, and role.
  - Interacts with `userApi` to register the new user.
  - Displays success/error messages via Redux state.

### Users List (`src/protected__modules/UsersList/`)

- **UsersList.tsx**: A paginated, searchable, and sortable table of all system users.
- **Functionality**:
  - Search by name.
  - Multi-column sorting (Full name, Email, Role, Active status).
  - Lifecycle actions: Toggle active status or delete users.
  - Optimized to avoid cascading renders.

### Account (`src/protected__modules/Account/`)

- **Account.tsx**: User profile management.
- **Features**:
  - View personal profile details (Name, Email, Role).
  - Password change form with validation and feedback.

### Ticket Management Modules

#### Create Ticket (`src/protected__modules/CreateTicket/`)

- **CreateTicket.tsx**: Form for requesters to submit new assistance requests.

#### My Tickets (`src/protected__modules/MyTickets/`)

- **MyTickets.tsx**: Specialized list for requesters to track their own submitted tickets.

#### Agent Tickets (`src/protected__modules/AgentTickets/`)

- **AgentTickets.tsx**: Workflow-focused view for agents to manage their assigned tickets.

#### Tickets (`src/protected__modules/Tickets/`)

- **Tickets.tsx**: Comprehensive view for administrators to see all system tickets and perform assignments.

## Layout and Routing

### Layout (`src/protected__modules/Layout/`)

- **Layout.tsx**: The master template for protected pages.
- **Includes**:
  - **Header**: Branding and Log out button.
  - **Navigation**: Sidebar with dynamic links based on user roles (Admin, Agent, Requester).
  - **Outlet**: Renders the specific page content.

### Routing (`App.tsx`)

- **BrowserRouter**: Root router for the application.
- **Nested Routes**: Uses the `Layout` component as a parent for protected routes.
- **Authentication Guard**: Proactively decodes auth state and redirects unauthenticated users to `/login`.
