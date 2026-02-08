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

## Layout and Routing

- **App.tsx**: contains the `BrowserRouter` and defines the main routes.
- **Protected Routes**: Logic implemented to redirect unauthenticated users to the `/login` page.
