# Attendance Admin

Private student attendance management built with React, strict TypeScript, Vite, Tailwind CSS and custom reusable components. React Hook Form, Zod 4, TanStack Query/Table, Lucide, Recharts, i18next and SheetJS are included. Supabase provides connected authentication, relational persistence, and private report storage. Vercel is the planned host.

## Run the React app

```powershell
cd C:\Users\MPSS\Desktop\LAP\attendance-app
npm ci
npm run dev
```

Open **http://127.0.0.1:5179/** and select **Open local preview**. The development preview uses fictional sample data stored locally in this browser. It is available for manual review and is disabled in production builds.

Available commands: `dev`, `build`, `preview`, `typecheck`, `lint`, `format`, `format:check`. No automated test suite is included.

## Project

- `src/app`: providers, routing, workspace repositories, response composition, and the shared data cache.
- `src/components`: custom UI components and the admin layout.
- `src/features`: semesters, groups, classes, students, attendance, imports, reports and authentication.
- `src/locales`: English and Myanmar resources.
- `src/styles`: shared design tokens and Tailwind/CSS.
- `design`: preserved interactive HTML design reference.
- `supabase`: relational schema, owner authorization, and connected workflow migration.
- `docs`: product specification, design and setup instructions.

Read [React implementation and current scope](docs/08-react-implementation.md) for details. [Setup and optimization](docs/04-setup-and-optimization.md) explains Supabase and Vercel configuration.

The React workflows now have a relational Supabase repository and private original-file storage. Apply **supabase/004_connected_workflows.sql** after the existing setup scripts to enable them, followed by **supabase/005_created_dates.sql** to expose creation dates in every table. See [Connected Supabase setup](docs/10-connected-supabase.md) for the next steps. With an empty database, start by creating a semester. Local preview data is not migrated automatically.

Hosted workflow verification, representative Zoom parsing, final wording review, and deployment remain pending. The owner confirmed real login; no hosted SQL or settings were changed by the coding agent. No passwords belong in application tables.

## Frontend organization

See [Frontend architecture](docs/09-frontend-architecture.md) for the approved reusable-component structure, feature schemas/constants/types, workflow hooks, and shared Excel/CSV utilities.
