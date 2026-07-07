# SAP Academy Simulator

A production-ready Next.js 15 training application for practicing ERP-style finance configuration and transaction workflows.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Prisma ORM
- SQLite for development
- ESLint 9

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate --name init
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
- Realistic seeded demo master data and journal entries
- Company Code create, read, update, and delete workflow powered by Server Actions
- Server Components for dashboard and data-backed pages

## Useful Commands

```bash
pnpm lint
pnpm build
pnpm prisma:generate
pnpm db:seed
```

## Demo Login

- Username: `admin`
- Password: `academy123`
