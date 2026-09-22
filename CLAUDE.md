# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server on **port 3031** (not 3000; matches `NEXTAUTH_URL`)
- `npm run build` / `npm run start` — production build & serve
- `npm run lint` / `npm run lint:fix` — ESLint (flat config)
- `npm run shadcn-add <component>` — add a shadcn/ui component (`bunx shadcn@latest add`)

Package manager is **bun** (`bun.lock`). No test runner is configured.

## Environment

Requires `.env` (see `.env.example`):
- `NEXT_PUBLIC_API_BASE_URL` — backend base; the client appends `/api` (see `endpoints.ts`)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (`http://localhost:3031`)

## Architecture

Next.js 16 (App Router, RSC) + React 19 + TypeScript. Tailwind CSS v4, shadcn/ui (new-york style), TanStack Query + Table, react-hook-form + Zod, NextAuth (credentials). Import alias `@/*` → `src/*`.

### API layer (the core pattern)
Every backend resource follows a strict three-file structure under `src/lib/apis/<resource>/`:
- **`*-api.ts`** — a class extending `BaseApi` (`src/lib/apis/base.ts`). `BaseApi` wraps axios and exposes typed `get/post/put/patch/delete`, auto-attaches the auth header via `headerAuth`, serializes query with `qs` (comma arrays), and has a response interceptor that signs out on 401 `Unauthorized` and normalizes error messages. Use `getPaginatedQuery(filters)` for list endpoints.
- **`*-schema.ts`** — Zod schemas for form/request validation.
- **`*-hook.ts`** — a `use<Resource>Api()` hook returning TanStack Query `useQuery`/`useMutation` wrappers. Query keys live in an exported `<resource>ApiQueryKeys` object. List hooks integrate `usePagination` (`src/hooks/use-pagination.ts`, backed by nuqs URL state).

API classes are instantiated once as singletons in `src/lib/apis/index.ts` (e.g. `customersApi`) and imported from there. Endpoint paths are centralized in `src/lib/apis/endpoints.ts`. Types live in `src/@types/module/<resource>/{request,response}.ts`; shared API envelope types (`BaseApiResult`, `BasePaginatedApiResult`, `PaginatedFilters`) in `src/@types/apis.type.ts`.

**Adding a resource:** create the four pieces (types, schema, api class, hook), register the endpoint in `endpoints.ts`, and export the singleton from `index.ts`.

### Routing & access control
Route groups under `src/app/`:
- `(auth)` — login/register
- `(dashboard)` — admin area; layout requires a session and **redirects `OPERATOR` role to `/cashier`**
- `cashier` — operator POS view

Auth is server-side via `getServerSession(nextAuthConfig)` in layouts (`src/cfgs/auth.cfg.ts`). Roles: `ADMIN`, `OPERATOR`. Session uses JWT strategy, a custom cookie `laundry-fe-session-token`, and stores the backend `token` on the session for API calls. Sidebar navigation is defined in `src/constants/paths.ts` (labels are in Bahasa Indonesia).

### Feature module convention
Page-specific code lives in a colocated `_module/` folder next to the route (e.g. `src/app/(dashboard)/master/customers/_module/components/`). Files use descriptive suffixes: `*.component.tsx`, `*-form.component.tsx`, `*-modals.component.tsx`, `*-filter-*.component.tsx`.

### Shared components
- `src/components/ui/` — shadcn primitives
- `src/components/base/` — app-level building blocks (`app-datatable`, `app-form`, `app-modals`, `app-sidebar`, etc.), prefixed `app-`
- `src/components/layouts/` — `dashboard-layout`, `cashier-layout`
- `src/providers/` — client providers (TanStack Query, NextAuth, nuqs, page loader); composed in the root layout

### Conventions
- Money: format with `formatMoney` (IDR); backend sends decimal strings — use `normalizeBackendValue` / `formatThousandSeparator` for inputs (`src/lib/utils/money.ts`). Dates via `src/lib/utils/time.ts` (id-ID locale).
- Prettier: double quotes, semicolons, 100 col, trailing commas; imports auto-sorted (`@ianvs/prettier-plugin-sort-imports`) + tailwind class sorting.
- User-facing strings are Bahasa Indonesia.
