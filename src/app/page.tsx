import { ArrowUpRight, Building2, Landmark, Store, UsersRound } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/dashboard/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentJournalEntriesTable } from "@/components/dashboard/recent-journal-entries-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/server/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { counts, recentJournalEntries } = await getDashboardSummary();

  return (
    <AppShell activePath="/">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge>Training client 800</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                Finance configuration and transaction simulator
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Practice enterprise accounting setup with guided master data, general ledger posting,
                vendor/customer records, and finance reports in a clean training workspace.
              </p>
            </div>
            <Button asChild>
              <Link href="/company-code">
                Maintain company codes
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Companies"
            value={counts.totalCompanies}
            detail="Configured legal entities"
            icon={Building2}
          />
          <MetricCard
            title="Total Customers"
            value={counts.totalCustomers}
            detail="Customer master records"
            icon={UsersRound}
          />
          <MetricCard
            title="Total Vendors"
            value={counts.totalVendors}
            detail="Vendor master records"
            icon={Store}
          />
          <MetricCard
            title="Total G/L Accounts"
            value={counts.totalGLAccounts}
            detail="Accounts in the chart"
            icon={Landmark}
          />
        </section>

        <RecentJournalEntriesTable entries={recentJournalEntries} />
      </div>
    </AppShell>
  );
}
