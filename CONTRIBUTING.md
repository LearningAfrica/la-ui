# Contributing to Learning Africa UI

This guide covers the conventions and workflows for contributing to the Learning Africa frontend. All team members should follow these standards to keep the codebase consistent and maintainable.

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd la-ui
   ```
2. **Install dependencies** (requires pnpm and Node >= 20):
   ```bash
   pnpm install
   ```
3. **Set up environment**: Copy `.env.example` to `.env` and fill in `VITE_API_BASE_URL`
4. **Create a branch** from `main` for your changes:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## Development Workflow

### Running the Dev Server

```bash
pnpm dev                    # Starts on port 3000
```

### Code Quality — Run After Every Change

```bash
pnpm lint:fix && pnpm format
```

### Type Checking

```bash
pnpm typecheck              # Runs react-router typegen + tsc
```

### Building for Production

```bash
pnpm build
```

---

## Security Practices

- **Never commit secrets**: Do not commit `.env` files, API keys, tokens, or credentials
- **Environment variables**: All sensitive config goes in `.env` (gitignored). Use `.env.example` as the template with placeholder values only
- **Dependencies**: Review new dependencies before adding them. Avoid packages with known vulnerabilities
- **Auth tokens**: Never log or expose auth tokens in client-side code or console output

---

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced by **commitlint** via a Husky `commit-msg` hook.

### Structure

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

### Types

| Type       | Description                                     | Example                                          |
| ---------- | ----------------------------------------------- | ------------------------------------------------ |
| `feat`     | New feature                                     | `feat(courses): add course preview page`         |
| `fix`      | Bug fix                                         | `fix(auth): resolve token refresh loop`          |
| `docs`     | Documentation only                              | `docs: update contributing guide`                |
| `style`    | Formatting, missing semicolons (no code change) | `style: fix indentation in layout`               |
| `refactor` | Code change that neither fixes nor adds         | `refactor(store): simplify auth slice logic`     |
| `test`     | Adding or updating tests                        | `test(modules): add module creation tests`       |
| `chore`    | Build, tooling, CI, dependencies                | `chore: update eslint config`                    |
| `perf`     | Performance improvement                         | `perf(dashboard): lazy load course tables`       |
| `ci`       | CI/CD configuration                             | `ci: add preview deploy workflow`                |
| `revert`   | Revert a previous commit                        | `revert: revert feat(courses) commit abc1234`    |

### Scopes

Use the feature or area being changed:

| Scope          | Area                                      |
| -------------- | ----------------------------------------- |
| `dashboard`    | Dashboard layout, shell, navigation       |
| `courses`      | Course listing, detail, CRUD              |
| `modules`      | Course modules management                 |
| `contents`     | Module content (lessons, resources)       |
| `categories`   | Category management                       |
| `auth`         | Authentication (login, register, tokens)  |
| `ui`           | Shared UI components (`components/ui/`)   |
| `forms`        | Form fields, schemas, validation          |
| `store`        | Redux store, slices                       |
| `api`          | API client, interceptors                  |
| `routes`       | Route definitions, layouts                |
| `config`       | Vite, env, build configuration            |
| `theme`        | Dark/light theme                          |

Scope is optional but encouraged. Omit it for cross-cutting changes.

### Rules

- **Subject**: Lowercase, imperative mood, no period at the end, max 72 characters
  - Good: `feat(courses): add course preview page`
  - Bad: `feat(courses): Added course preview page.`
- **Body**: Explain _what_ and _why_, not _how_. Wrap at 72 characters.
- **Footer**: Reference related tickets where applicable
- **Breaking changes**: Add `BREAKING CHANGE:` in the footer or `!` after the type:

  ```
  feat(api)!: change pagination response format

  BREAKING CHANGE: PaginatedResponse now uses `items` instead of `data`
  ```

### Examples

```
feat(courses): add course preview page with module listing

Added a route at /courses/$courseId/preview that renders the full
course details, modules, and content for preview purposes.
```

```
fix(auth): prevent redirect loop on expired token

The 401 interceptor was clearing auth state and redirecting to /login
even when already on the login page, causing an infinite loop.
```

```
chore: update TanStack Query to v5.90
```

---

## Branch Naming

Use the format: `<type>/<short-description>`

```
feat/course-preview-page
fix/auth-redirect-loop
chore/update-dependencies
refactor/simplify-theme-slice
docs/update-contributing-guide
```

---

## Pull Request Process

1. **Run checks before pushing**:
   ```bash
   pnpm lint:fix && pnpm format && pnpm typecheck
   ```
2. **Keep PRs focused** — one feature or fix per PR
3. **Write a clear PR description** with:
   - Summary of changes (bullet points)
   - Test plan (how to verify)
   - Screenshots for UI changes
4. **Reference related tickets** in the PR description

### PR Title

Follow the same commit message format for the PR title:

```
feat(courses): add course preview page
fix(auth): resolve token refresh loop
```

### PR Checklist

- [ ] Branch is up to date with `main`
- [ ] `pnpm lint:fix && pnpm format` passes
- [ ] `pnpm typecheck` passes
- [ ] No new warnings or errors
- [ ] Self-review completed
- [ ] No secrets or credentials in the code

### Code Review

- All PRs require at least one approval before merging
- Reviewers should check for correctness, readability, and adherence to project conventions
- Address all review comments before merging — resolve or discuss, don't ignore
- Use "Request Changes" for blocking issues, "Comment" for suggestions

---

## Git Hooks

This project uses **Husky** with two hooks:

### `pre-commit` — Lint & Format

Runs **lint-staged** on staged files:

- `*.{ts,tsx,js,jsx}`: ESLint with `--fix` + Prettier
- `*.{json,css,md}`: Prettier

### `commit-msg` — Commit Message Lint

Runs **commitlint** to enforce [Conventional Commits](https://www.conventionalcommits.org/) format. Rejects commits that don't match `<type>(<scope>): <subject>`.

**Valid:**

```
feat(courses): add course preview page
fix(auth): resolve token refresh loop
chore: update dependencies
```

**Rejected:**

```
added course page          # missing type
Feat(courses): Add stuff   # uppercase type and subject
feat(courses).             # period at end
```

If a hook fails, fix the reported issues before committing. Do not bypass with `--no-verify`.

---

## Environments

| Environment | Branch | URL     | Notes                |
| ----------- | ------ | ------- | -------------------- |
| Development | `main` | Local   | Dev server (port 3000) |
| Production  | `main` | Netlify | Deployed via Netlify |

- Do not push directly to `main` — always use PRs
- Test your changes locally before opening a PR

---

## Questions?

If you have questions about contributing, consult with the team directly.
