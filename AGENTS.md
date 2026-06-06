# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**Alpha** is a single mobile-first RTL Arabic web app (TanStack Start + React 19 + Vite). One dev server serves all modules (Bible, Agpeya, Katameros, Synaxarium, Feasts, Church, Profile). Remote **Supabase** provides Bible/dictionary data; other modules use static mock data and `localStorage`.

### Required services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `bun run dev` | **8080** | Only local process required for development |
| Supabase (hosted) | — | — | Credentials are hardcoded in `src/integrations/supabase/client.ts`; no `.env` needed |

### Package manager

Use **Bun** (`bun.lock`, `bunfig.toml`). Bun is installed to `~/.bun/bin` on first setup. Ensure it is on `PATH`:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

`npm install` also works via `package-lock.json` if Bun is unavailable.

### Common commands

See `package.json` scripts:

- **Dev:** `bun run dev` → http://localhost:8080
- **Lint:** `bun run lint` (many pre-existing Prettier formatting findings)
- **Build:** `bun run build`
- **Unit tests:** `bunx vitest run src/` (do not run bare `vitest run` — it picks up Playwright specs in `e2e/`)
- **E2E:** `bunx playwright test` (install browsers once: `bunx playwright install chromium`; dev server on 8080 or auto-started by Playwright config)

### Gotchas

- **Port 8080** is fixed by `@lovable.dev/vite-tanstack-config` (not 5173).
- **No docker-compose** or local Postgres — Supabase is remote only.
- **Playwright E2E:** set `E2E_BASE_URL=http://localhost:8080` when the dev server is already running to skip `webServer` auto-start.
- **Lint:** `bun run lint` exits non-zero due to widespread Prettier drift; this is a known repo state, not an environment issue.
- **E2E flakes:** some `e2e/synaxarium-feasts.spec.ts` assertions may fail when UI copy/selectors drift from tests (12/16 E2E tests pass as of initial cloud setup).
- **Diagnostics:** `/diagnostics` confirms Supabase connectivity (books/verse counts).
- **Production deploy** targets Cloudflare Workers (`wrangler.jsonc`); not required for local dev.

### Hello-world verification

1. `bun run dev`
2. Open `/home` — Arabic RTL home with bottom navigation
3. Visit `/agpeya/baker` — prayer content loads
4. Visit `/diagnostics` — Supabase status `ok`
