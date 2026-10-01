# AI Agent Project Context: Organization Safety App

This file is intended to provide immediate, high-level architectural and technical context to any AI agents or developers working on this project. 

## 1. Project Overview
**Domain**: A disaster preparedness program/SaaS for organizations.
**Architecture**: Monorepo managed with **Turborepo** and **pnpm**. 
**Core Concept**: A multi-tenant application where organizations apply to join, are vetted by a Super Admin, and upon approval, receive an isolated workspace.

## 2. Directory Structure
The monorepo uses `pnpm-workspace.yaml` with applications living in `app/`.
- `/app/client`: Next.js frontend application.
- `/app/server`: NestJS backend GraphQL API.

## 3. Server Architecture (`app/server`)
- **Framework**: NestJS (v12)
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL (via TypeORM)
- **Language**: TypeScript

### Multi-Tenancy Strategy (CRITICAL)
The application implements **schema-based multi-tenancy** in PostgreSQL.
- **Global Schema (public)**: Stores system-wide entities like `SuperAdmin` and `Tenant` (registered organizations).
- **Tenant Schemas**: When the Super Admin creates a organization (via `OnboardingService.createOrganization`), the system dynamically:
  1. Creates a new Postgres schema (e.g., `tenant_myorganization_173456789`).
  2. Runs raw SQL to create tenant-specific tables (e.g., `users`) within that schema.
  3. Provisions an initial `TENANT_ADMIN` user in that schema.

### Authentication Flows
There are two distinct login pathways:
1. **Super Admin** (`superAdminLogin` mutation): 
   - Checks against the global `SuperAdmin` entity. 
   - Uses bcrypt for password hashing.
   - Default seeded credentials: `admin@organizationsafety.com` / `admin123`.
2. **Tenant User** (`tenantLogin` mutation):
   - Requires `email`, `password`, and `tenantId`.
   - Looks up the tenant's `schemaName`, then queries the dynamically created `<schema_name>."users"` table.
   - JWT tokens include `tenantId` and `schemaName` in the payload for subsequent requests.

## 4. Client Architecture (`app/client`)
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **API Client**: `graphql-request` directly hitting the NestJS GraphQL endpoint.
- **Types/Codegen**: See `/app/client/AGENTS.md` for a dump of the GraphQL schema available to the frontend.

### Key Routes
- `/` or `/dashboard`: Likely the dashboard for tenant users (organizations).
- `/admin`: Super Admin dashboard (used to create new organizations and view passwords).
- `/login`: Universal login entry point.

## 5. Development Scripts (Root)
- `pnpm install`: Install dependencies.
- `pnpm dev`: Starts both frontend and backend concurrently via Turborepo.
- `pnpm build`: Builds both applications.

## 6. Current Technical Debt & Quirks (Watch Out!)
- **Plain Text Passwords for Tenants**: Currently, dynamically generated passwords for tenant users (like the initial `TENANT_ADMIN`) are stored and verified in **plain text**. Super Admins use proper bcrypt hashing. Do not be confused if tenant auth bypasses bcrypt.
- **Raw SQL for Tenant Provisioning**: Table creation for new tenants (`users` table) is currently hardcoded in raw SQL within `OnboardingService.createOrganization` rather than using TypeORM migrations. If you add fields to tenant users, you must update the raw SQL in `onboarding.service.ts`.
