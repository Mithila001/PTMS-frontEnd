# Public Transport Management System - Frontend 🚌

A modern, responsive administrative dashboard built with **React** and **TypeScript** to manage all operations of the Public Transport Management System (PTMS) Backend API.

This application provides a user-friendly interface for managing buses, routes, personnel, and scheduled trips, centralizing control over the entire transport system.

---

## 🔗 Technical Stack

| Category       | Technology                      | Purpose                                                         |
| :------------- | :------------------------------ | :-------------------------------------------------------------- |
| **Framework**  | **React 19**                    | Core UI library for component-based development.                |
| **Language**   | **TypeScript**                  | Ensures type safety and improves code quality.                  |
| **Build Tool** | **Vite**                        | Fast, modern front-end tooling for development and building.    |
| **Styling**    | **Tailwind CSS**                | Utility-first CSS framework for rapid and consistent styling.   |
| **Routing**    | **React Router DOM**            | Handles application navigation and protected routes.            |
| **Mapping**    | **Leaflet** / **React-Leaflet** | Integrates interactive maps for geospatial route visualization. |

---

## ✨ Key Features

This frontend application is designed as a single-page administrative dashboard accessible based on user roles (`ADMIN`, `OPERATIONS_MANAGER`).

- **Role-Based Access:** Secures navigation and UI elements based on the authenticated user's role.
- **Comprehensive Management:** Dedicated management pages for:
  - **Vehicles** (`/buses`): Register, view, and update bus details.
  - **Personnel** (`/employees`): Manage **Drivers** and **Conductors**.
  - **Routes** (`/routes`): Define routes, view route details on a map.
  - **Scheduling** (`/scheduled-trips`): Plan and manage the trip timetable.
  - **Assignments** (`/assignments`): Assign vehicles and employees to scheduled trips.
- **Centralized Dashboard:** Provides key operational metrics and system health overview.
- **Auditing & Logging:** Pages to view detailed historical audit logs and user actions.
- **Atomic Design:** UI is structured using the **Atomic Design** principle (atoms, molecules, organisms) for maintainability.

---

## ⚙️ Backend API Connection

This frontend is designed to interact exclusively with the **PTMS Backend API** located at:

- **API Base URL (Default):** `http://localhost:8080/api`
- **CORS:** Ensure this frontend application's address (`http://localhost:5173` by default) is listed in the backend's `CORS_ALLOWED_ORIGINS` environment variable.

You can find the backend repository here: **[PTMS-Backend-API Repository](https://github.com/Mithila001/PTMS-Backend)**

---

## 🛠️ Local Installation & Setup (Non-Docker)

These instructions cover running the frontend locally for development.

### 1. Prerequisites

You must have **Node.js** (version 18 or higher recommended) and **npm** or **yarn** installed.

### 2. Clone the Repository

```bash
git clone https://github.com/Mithila001/PTMS-frontEnd.git
```

```bash
cd ptms-frontEnd
```

### 3. Configure Environment

Create a local environment file named `.env` in the root directory. This file must contain the base URL of the running backend API.

```bash
# .env file content
VITE_API_BASE_URL=/api
```

> [!NOTE]
> Ensure the backend API is running before starting the frontend application.

### 4. Install Dependencies

Install all required packages listed in `package.json`:

```bash
npm install
# OR
yarn install
```

### 5. Run the Application

Start the application in development mode:

```bash
npm run dev
# OR
yarn dev
```

The application should now be accessible in your web browser, typically at `http://localhost:5173`.

---

## 📁 Project Structure Overview

The project is structured following standard React best practices, utilizing a clean separation for API services, components, context, and pages.

```
ptms-frontEnd/
├── src/
│   ├── api/             # Functions for interacting with the backend API (authService, busService, etc.)
│   ├── assets/          # Static assets (images, styles)
│   ├── components/      # Reusable UI parts, separated by Atomic Design
│   │   ├── atoms/       # Base elements (buttons, inputs)
│   │   ├── molecules/   # Groups of atoms (DataTable, SearchInputForm)
│   │   ├── organisms/   # Groups of molecules (SearchAndFilter)
│   │   └── shared/      # Layout components (Header, Sidebar, PrivateRoute)
│   ├── contexts/        # React Contexts (AuthContext, ToastContext)
│   ├── hooks/           # Custom React hooks (useValidation, useRouteSearch)
│   ├── pages/           # Top-level application routes (LoginPage, DashboardPage)
│   │   └── admin/       # Nested pages for management modules
│   ├── schemas/         # Validation schemas
│   ├── types/           # TypeScript interfaces and types
│   └── utils/           # Helper functions (converters, comparators, error handling)
└── vite.config.ts       # Vite configuration
```

---

## 📄 License

This project is licensed under the MIT License
