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
- `src/features`: semesters, groups, classes, students, attendance, imports, reports, authentication and connection routing.
- `api`: the Vercel function that selects a connection from the visitor's IP country.
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

For networks where both Supabase and the Worker fail, see [Vercel relay connectivity](docs/15-vercel-relay-connectivity.md). The hosted app can recover through `/api/supabase` on its own Vercel origin and remember that choice. Deploy the updated `vercel.json` together with the frontend; no new environment variables are required.

Follow [Cloudflare Worker setup](docs/11-cloudflare-worker-setup.md) to deploy the included Worker through Cloudflare's dashboard, verify reachability from Myanmar, and configure Vercel. Connected mode requires `VITE_SUPABASE_PROXY_URL` alongside the original `VITE_SUPABASE_URL` and publishable key. Myanmar and unknown IP countries use the Worker; other recognized countries try direct Supabase. If the direct connection fails, the app automatically switches to Cloudflare and remembers that preference across browser visits. Auth, RPCs, and private report uploads/downloads share the selected route and the existing project-specific login storage key. See [Automatic connection routing](docs/12-automatic-connection-routing.md) for deployment and manual verification.

The maintained TypeScript source is in `cloudflare/supabase-proxy/src`; the ready-to-paste dashboard module is `cloudflare/supabase-proxy/worker.js`. Run `npm run build:worker` after source changes. This uses the project's existing TypeScript, Vite, and Prettier packages. Deployment is performed separately by the owner. No Cloudflare runtime package is added to the React app.

## Name-only Zoom attendance imports

Apply `supabase/009_zoom_name_matching.sql` after the current 008 workspace migration. The importer now matches registered and administrator-approved Zoom names, suggests close names for review, asks before saving names in parentheses, and ignores waiting-room, host/co-host, and generic device rows. Contact emails are not used for attendance matching. See [Name-only Zoom imports](docs/13-zoom-name-matching.md) before deployment.

## Public class links

Use **Share class** on a class page to create, copy, replace, or revoke a read-only link. Anyone with the link can view that class's students and finalized session attendance, including remarks. Contact details, private notes, Zoom reports, and audit history are excluded by a separate database endpoint. Apply the local `supabase/010_public_class_sharing.sql`, update the generated Cloudflare Worker, and deploy the frontend before sharing real links. See [Public class sharing setup](docs/14-public-class-sharing.md).
