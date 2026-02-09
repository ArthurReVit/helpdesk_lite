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
  - collects full name, email, password, and role.
  - Interacts with `userApi` to register the new user.
  - Displays success/error messages via Redux state.

## Layout and Routing

### Layout (`src/protected__modules/Layout/`)

- **Layout.tsx**: The master template for protected pages.
- **Includes**:
  - **Header**: Branding and Log out button.
  - **Navigation**: Links to Dashboard and (for admins) Add User.
  - **Outlet**: Renders the specific page content.

### Routing (`App.tsx`)

- **BrowserRouter**: Root router for the application.
- **Nested Routes**: Uses the `Layout` component as a parent for protected routes.
- **Authentication Guard**: Redirects unauthenticated users to `/login`.
