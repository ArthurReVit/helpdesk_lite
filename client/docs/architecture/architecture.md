# Client Architecture

## Overview

The Helpdesk Lite client application is structured to separate concerns between business logic, state management, and UI presentation.

## Directory Structure

- `src/lib/app_state/`: Contains the Redux store, slices, and RTK Query API definitions.
- `src/models/`: TypeScript interfaces and types shared across the application.
- `src/public_modules/`: Features accessible without authentication (e.g., Login).
- `src/protected__modules/`: Features requiring authentication (e.g., Dashboard).
- `src/App.tsx`: The root component handling routing and global providers.

## Module Categorization

### Public Modules

- **Login**: Handles user authentication and token storage.

### Protected Modules

- **Dashboard**: The main interface for authenticated users to view and manage tickets.

### Library (lib)

- **app_state**: Centralized logic for authentication state, API interactions, and store configuration.
