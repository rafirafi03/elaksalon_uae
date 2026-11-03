# ELAK Salon UAE (monorepo)

```text
apps/site      → public site (www) — port 3000
apps/admin     → admin dashboard — port 3001
packages/db    → Supabase clients & types
packages/ui    → shared UI primitives
packages/config
supabase/      → migrations & seed
```

## Setup

```bash
npm install
cp apps/site/.env.example apps/site/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

## Develop

```bash
npm run dev:site     # http://localhost:3000
npm run dev:admin    # http://localhost:3001
npm run dev:all      # both
```

## Build

```bash
npm run build:site
npm run build:admin
```

See `MONOREPO.md` for migration checklist.
