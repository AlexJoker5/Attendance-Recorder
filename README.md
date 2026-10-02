# Attendance Admin

Private student attendance management built with React, strict TypeScript, Vite, Tailwind CSS and custom reusable components. React Hook Form, Zod 4, TanStack Query/Table, Lucide, Recharts, i18next and SheetJS are included. Supabase provides connected authentication, relational persistence, and private report storage. The owner-provided hosted address is https://www.lap-attendance.vercel.app.

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

## Cloudflare connectivity proxy

Follow [Cloudflare Worker setup](docs/11-cloudflare-worker-setup.md) to deploy the included Worker through Cloudflare's dashboard, verify reachability from Myanmar, and configure Vercel. The optional `SUPABASE_PROXY_URL` routes Auth, RPCs, and private report uploads/downloads through the Worker. Keep the original `SUPABASE_URL` and publishable key. The existing project-specific login storage key is preserved.

The maintained TypeScript source is in `cloudflare/supabase-proxy/src`; the ready-to-paste dashboard module is `cloudflare/supabase-proxy/worker.js`. Run `npm run build:worker` after source changes. This uses the project's existing TypeScript, Vite, and Prettier packages. Deployment is performed separately by the owner. No Cloudflare runtime package is added to the React app.
