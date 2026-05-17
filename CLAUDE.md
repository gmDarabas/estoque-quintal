# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
docker compose up --build   # start dev server (instala deps e roda npm run dev)
docker compose down         # parar os containers
```

Para comandos pontuais (lint, build, prettier):

```bash
docker compose run --rm app npm run build   # tsc + vite build
docker compose run --rm app npm run lint    # eslint com --fix, zero warnings
docker compose run --rm app npm run pretty  # prettier em todos os arquivos
```

No test suite is configured.

## Environment

Copy `.example.env` to `.env`. Required variables:

```
VITE_SUPABASE_URL=     # Supabase project URL
VITE_SUPABASE_TOKEN=   # Supabase anon key
VITE_PORT=             # dev server port (omit in production builds)
```

`VITE_PORT` also controls `vite.config.ts` base path: when present the base is `''`; when absent it becomes `/pfc-manutencoes/`.

## Architecture

Toda a comunicação com o backend é via **Supabase** (`src/supabaseClient.ts`). Queries usam `supabase.from(...)` diretamente nos arquivos de API de cada feature. A listagem de produtos lê da view `v_produtos` (não da tabela `produtos`). Soft-delete: registros têm `deleted_at`; a view os filtra.

### Feature-slice structure

```
src/features/<domain>/
  api/           # types.ts + one file per operation (list, create, update, delete, …)
  components/    # domain-specific UI components
  page-*.tsx     # routed page components
```

The only domains today are `auth` and `admin/{produtos,categorias,home}`.

### Auth flow

`AuthContextProvider` (`src/features/auth/providers/auth-context.tsx`) stores the Supabase `User` object in `localStorage` under `authContext`. `Router` (`src/routes/index.tsx`) renders either `AuthRoutes` or `AdminRoutes` based on whether that context is set. The router uses `HashRouter`.

### Data fetching pattern

API list functions return `Page<T>` (`src/types/interfaces.ts`). The `usePaginator` hook (`src/lib/use-paginator.ts`) wraps `react-query`'s `useQuery` and exposes an Ant Design-compatible `pagination` prop. Use it for every paginated table.

### Styling

Ant Design 5 with a custom theme defined inline in `App.tsx` (light + dark variants). Dark mode is toggled via `ThemeContext` (`src/contexts/theme-context.tsx`). Tailwind is also available but Ant Design tokens are the primary styling mechanism. The `@` alias resolves to `src/`.
