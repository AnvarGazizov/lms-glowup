# Extension Template

A Chrome extension and API monorepo built with **Plasmo**, **Next.js**, and **Supabase**.

## Project Structure

```
apps/
  web/          → Next.js app (API routes + web dashboard), deployed to Vercel
  extension/    → Chrome extension built with Plasmo + React
packages/
  shared/       → Shared TypeScript types and utilities
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local dev)

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

   Fill in your Supabase project URL and anon key.

3. **Start development:**

   ```bash
   # Start everything
   pnpm dev

   # Or start individually
   pnpm dev:web        # Next.js at http://localhost:3000
   pnpm dev:extension  # Plasmo extension (hot-reload)
   ```

4. **Load the extension in Chrome:**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `apps/extension/build/chrome-mv3-dev`

## Building for Production

```bash
# Build everything
pnpm build

# Build individually
pnpm build:web
pnpm build:extension
```

## API Routes

API routes live in `apps/web/src/app/api/`. The extension communicates with these endpoints.

- `GET /api/health` — Health check

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **API:** Next.js App Router (Vercel)
- **Database/Auth:** Supabase (Postgres, Auth, Row-Level Security)
- **Extension:** Plasmo (React + TypeScript)
- **Styling:** Tailwind CSS
