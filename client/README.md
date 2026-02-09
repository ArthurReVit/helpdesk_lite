# Helpdesk Lite - Client

A modern, responsive support ticket management dashboard built with React 19, Redux Toolkit, and Vite.

## 🚀 Key Features

- **Robust Authentication**: Secure login with JWT persistence and automatic session recovery.
- **Support Ticket Lifecycle**: 
  - Creation, assignment, and status management for tickets.
  - Role-based views (Admin, Agent, and Requester).
  - Staff-only internal comments for collaboration.
- **User Management**:
  - Full CRUD operations for system users.
  - Search, pagination, and multi-column sorting.
- **Account Dashboard**: Personal profile management and secure password change.
- **Audit Logging**: Comprehensive event tracking for all ticket movements.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Testing/Linting**: ESLint, TypeScript
- **Styling**: Vanilla CSS (Custom Modular System)

## 📁 Project Structure

```text
client/
├── docs/                 # Detailed architectural & feature documentation
├── src/
│   ├── lib/app_state/    # Redux store, slices, and RTK Query APIs
│   ├── models/           # TypeScript interfaces and types
│   ├── protected__modules/ # Components requiring authentication
│   └── public_modules/    # Public-facing components (e.g., Login)
└── public/               # Static assets
```

## 🛠 Setup & Development

### 1. Requirements
- Node.js (Latest LTS)
- Running [Helpdesk Lite Server](../../server/README.md)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `client/` root:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the App
```bash
npm run dev
```

## 📄 Documentation
For more detailed information, please refer to the files in the `docs/` directory:
- [Components & Modules](./docs/components/components.md)
- [State Management](./docs/state-management/state.md)
- [Changelogs](./docs/changelog/)
