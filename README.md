# SAP Academy Simulator

A production-ready Next.js 15 training application for practicing ERP-style finance configuration and transaction workflows.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Prisma ORM
- SQLite for local development
- Postgres-compatible production database for Vercel
- ESLint 9

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:push:local
pnpm db:seed
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Features

- Demo login gate for the training workspace
- Responsive blue-and-white enterprise dashboard shell
- Left sidebar navigation for core finance training areas
- Top navigation with search, alerts, settings, and user affordances
- Prisma models for Company, FiscalYearVariant, ChartOfAccounts, GLAccount, Customer, Vendor, JournalEntry, and JournalLine
- Currency master data seeded for production and local development
- Realistic seeded demo master data and journal entries
- Company Code create, read, update, and delete workflow powered by Server Actions
- Server Components for dashboard and data-backed pages
- Database fallbacks so pages render empty states instead of crashing when schema/data is unavailable

## Useful Commands

```bash
pnpm lint
pnpm build
pnpm prisma:generate
pnpm prisma:generate:prod
pnpm prisma:deploy
pnpm db:seed
pnpm db:seed:prod
```

## Vercel Deployment

1. Provision Vercel Postgres, Neon, Supabase, or another Postgres-compatible database.
2. Set `DATABASE_URL` in Vercel project environment variables. See `.env.production.example`.
3. Keep the Vercel build command as `pnpm vercel-build`.

`pnpm vercel-build` runs:

```bash
prisma generate --schema=prisma/schema.prisma
prisma migrate deploy --schema=prisma/schema.prisma
prisma db seed --schema=prisma/schema.prisma
next build
```

The production Prisma schema is `prisma/schema.prisma` and uses Postgres. The local schema is `prisma/schema.sqlite.prisma` and uses SQLite.

## Demo Login

- Username: `admin`
- Password: `academy123`
