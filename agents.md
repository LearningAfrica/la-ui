# Agents Guide — Learning Africa UI

## How to Operate with Claude Code + Playwright MCP

### Setup

The Playwright MCP server is configured in `.mcp.json` at project root:
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": { "BROWSER": "chromium" }
    }
  }
}
```

### Browser Automation Workflow

1. **Navigate** — Use `browser_navigate` to open pages (`http://localhost:3000/...`)
2. **Inspect** — Use `browser_snapshot` to get the page's accessibility tree (element refs, text, structure)
3. **Interact** — Use `browser_click`, `browser_type`, `browser_fill_form` with element `ref` from snapshots
4. **Screenshot** — Use `browser_take_screenshot` to capture visual state
5. **Close** — Use `browser_close` to reset browser state if file chooser modals or other state gets stuck

### Screenshot Convention

Store screenshots in `.playwright-mcp/screenshots/` grouped by page:
```
.playwright-mcp/screenshots/
├── landing/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
├── dashboard/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
├── categories/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
└── <page-name>/
    └── ...
```

### Responsive Testing Viewports

| Device       | Width | Height |
|-------------|-------|--------|
| Mobile      | 375   | 812    |
| Tablet      | 768   | 1024   |
| Desktop     | 1440  | 900    |

Use `browser_resize` before taking screenshots at each viewport.

### Known Limitations

- **File chooser dialogs**: Clicking file upload buttons triggers native OS file pickers that queue up in Playwright. If stuck, use `browser_close` to reset and `browser_navigate` to re-open the page. The file upload works fine in real browsers.
- **Snapshot vs Screenshot**: `browser_snapshot` returns the accessibility tree (needed to get element refs for interaction). `browser_take_screenshot` returns a visual image (for review only, can't interact based on it).

### Adding a New Feature (CRUD Pattern)

When adding a new resource (e.g., "topics"), follow this order:

1. **Query keys** — `app/features/topics/topic-query-keys.ts`
   - Define `all`, `list(page, search)`, `detail(id)` keys
   - Always spread `all` in derived keys: `[...topicQueryKeys.all, page]`

2. **Queries** — `app/features/topics/topic-queries.ts`
   - Define the TypeScript interface
   - Create `useTopics(params)` hook with `useQuery`

3. **Mutations** — `app/features/topics/topic-mutations.ts`
   - `useCreateTopic`, `useUpdateTopic`, `useDeleteTopic`
   - Each invalidates `queryKeys.all` on success
   - Use `toFormData()` if the resource has file uploads

4. **Schema** — `app/lib/schema/topic-schema.ts`
   - Zod schema with `zodResolver`

5. **Dialogs** — `app/components/dashboard/`
   - `create-topic-dialog.tsx` — Form in a `Dialog`, uses `useAppModal("create-topic")`
   - `edit-topic-dialog.tsx` — Pre-fills form from `modal.data`, uses `useUpdateTopic`
   - `view-topic-dialog.tsx` — Read-only detail view
   - `delete-topic-dialog.tsx` — `AlertDialog` confirmation, uses `useDeleteTopic`
   - Register modal data types via `declare module "@/stores/filters/modal-slice"`

6. **Table** — `app/components/dashboard/admin-topics-table.tsx`
   - Define columns with `createColumnHelper<Topic>()`
   - Add Actions column with dropdown (View, Edit, Delete)
   - Render all dialogs inside the table component

7. **Route page** — `app/routes/client.dashboard.topics.tsx`
   - Use `useTableFilters` for pagination/search
   - Render stats card + table + pagination

### Modal Registration Pattern

Every dialog that uses the Redux modal system must declare its data type:
```ts
declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "view-topic": Topic;
    "edit-topic": Topic;
    "delete-topic": Topic;
    "create-topic": undefined;
  }
}
```

### Dev Server

- Run `npm run dev` to start on port 3000
- Backend API URL is in `.env` as `VITE_API_BASE_URL`
- Type check with `npm run typecheck` before committing
