# laundry-fe

Frontend for a laundry management system: dashboard (admin), cashier/POS (operator), master data, and transactions. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, react-hook-form + Zod, and NextAuth.

## Getting Started

Package manager is [bun](https://bun.sh).

```bash
bun install
```

Copy the env template and fill in the values:

```bash
cp .env.example .env
```

- `NEXT_PUBLIC_API_BASE_URL` — backend base URL (the client appends `/api`)
- `NEXTAUTH_SECRET` — NextAuth secret
- `NEXTAUTH_URL` — `http://localhost:3031`

Run the dev server:

```bash
bun run dev
```

Open [http://localhost:3031](http://localhost:3031).

## Scripts

- `bun run dev` — dev server on port 3031
- `bun run build` — production build
- `bun run start` — serve the production build
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run shadcn-add <component>` — add a shadcn/ui component

## Project structure

- `src/app/` — routes (App Router). Route groups: `(auth)`, `(dashboard)`, and `cashier`. Page-specific code is colocated under `_module/`.
- `src/lib/apis/` — API layer; one folder per resource (`*-api.ts`, `*-schema.ts`, `*-hook.ts`).
- `src/components/` — `ui/` (shadcn primitives), `base/` (app building blocks), `layouts/`.
- `src/@types/`, `src/hooks/`, `src/providers/`, `src/constants/`, `src/lib/utils/`.

See [CLAUDE.md](CLAUDE.md) for architecture details and conventions.
