# Learning Africa UI

## Project Overview

Learning Africa is a multi-tenant learning management platform for African organizations. Instructors create courses, track learner progress, and issue certificates — all scoped per organization.

## Tech Stack

- **Framework**: React Router v7 (file-based routing)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **State Management**: Redux Toolkit (modals, filters, organization context)
- **Data Fetching**: TanStack Query (React Query) with Axios
- **Forms**: React Hook Form + Zod validation
- **Build**: Vite
- **Deployment**: Netlify

## Project Structure

```
app/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── dashboard/    # Dashboard-specific components (tables, dialogs)
│   ├── form-fields/  # Reusable form field components
│   └── auth/         # Auth forms (login, register)
├── features/         # Feature modules (queries, mutations, query keys)
├── hooks/            # Custom React hooks
├── layouts/          # Layout components (dashboard shell, auth layout)
├── lib/              # Utilities, API client, schemas, types
│   ├── api/          # Axios client with auth interceptors
│   ├── schema/       # Zod validation schemas
│   └── utils/        # Helpers (toFormData, etc.)
├── providers/        # Context providers
├── routes/           # Route components (file-based)
├── stores/           # Redux slices and hooks
│   ├── filters/      # Table filters, modal state (Redux)
│   └── organization/ # Selected organization context
├── root.tsx          # App root
└── routes.ts         # Route definitions
```

## Key Patterns

### Feature Module Pattern
Each feature (e.g., categories, courses) lives in `app/features/<name>/` with:
- `<name>-queries.ts` — TanStack Query hooks (`useQuery`)
- `<name>-mutations.ts` — TanStack mutation hooks (`useMutation`)
- `<name>-query-keys.ts` — Query key factory for cache invalidation

### Modal System (Redux)
Modals use a typed Redux system. Register modal data types via module augmentation:
```ts
declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "my-modal": { id: string };
  }
}
```
Use `useAppModal("my-modal")` to get `{ isOpen, data, open, close, toggle }`.

### Form Pattern
- Zod schema in `app/lib/schema/<name>-schema.ts`
- `zodResolver` for React Hook Form
- Reusable `FormTextField` / `FormTextareaField` from `@/components/form-fields`
- File uploads use `toFormData()` utility with `multipart/form-data`

### Table Pattern
- TanStack Table with `DataTable` wrapper component
- Table filters/pagination managed via `useTableFilters()` Redux hook
- Actions column uses dropdown menu with modal triggers

### Conditional / Merged Styling
Use the `cn()` utility (from `@/lib/utils`) for conditional or merged class names:
```ts
import { cn } from "@/lib/utils";
cn("base-class", isActive && "active-class", className)
```

### useEffectEvent Pattern
Use `useEffectEvent` (React 19) to separate "what to do" from "when to do it" in effects. This avoids stale closures and keeps dependency arrays clean.

**When to use:** When an effect needs to read the latest props/state but shouldn't re-run when those values change. Common in dialogs that populate forms on open, event handlers in effects, or any effect that reads values it shouldn't synchronize on.

```ts
import { useEffect, useEffectEvent } from "react";

// The callback always reads latest values, can accept args from useEffect
const onDialogOpened = useEffectEvent((entity: Entity | null) => {
  if (!entity) return;
  form.reset({ name: entity.name }); // reads latest form, selectedOrg, etc.
});

// Effect only re-runs when isOpen/isEditing change, not when entity details change
useEffect(() => {
  if (isOpen && isEditing) {
    onDialogOpened(entity);
  }
}, [isOpen, isEditing, entity]);
```

**Rules:**
- Call `useEffectEvent` at the top level of the component
- Only call the returned function from inside `useEffect` (never during render)
- Do NOT include it in the effect's dependency array
- Use early returns inside the callback to offload conditions from useEffect

### Theme
Only two themes: `dark` and `light`. System preference is used to determine the initial theme. Toggle simply switches between the two. No "system" option in the UI.

### Query Key Structure
Always spread `all` in derived keys for proper cache invalidation:
```ts
export const queryKeys = {
  all: ["items"] as const,
  list: (page?: number) => [...queryKeys.all, page] as const, // spread, don't nest
};
```

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run typecheck` — Type check (`react-router typegen && tsc`)
- `npm run lint` — ESLint
- `npm run lint:fix` — ESLint with auto-fix
- `npm run format` — Prettier format
- `npm run format:check` — Prettier check

## After Code Changes
Always run lint fix first (may restructure code), then format (cleans up style):
```bash
npm run lint:fix && npm run format
```

## MCP / Playwright

The project has a Playwright MCP server configured in `.mcp.json` for browser automation. Screenshots are stored in `.playwright-mcp/screenshots/` grouped by page name (e.g., `landing/`, `dashboard/`, `categories/`).

## API

The backend API base URL is configured via `VITE_API_BASE_URL` in `.env`. API calls go through `apiClient` (Axios instance) in `app/lib/api/`. All authenticated requests include the auth token via interceptors.
