import {
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Store,
  UsersRound,
} from "lucide-react";
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
              <Badge>SAP FICO learning workspace</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                SAP FICO Training Platform
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Learn finance concepts, practice SAP-style configuration and posting tasks, then
                challenge yourself with scored exercises across FI and CO scenarios.
              </p>
            </div>
            <Button asChild>
              <Link href="/fico-academy">
                Open FICO Academy
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="FICO Courses"
            value={counts.totalCourses}
            detail="Structured learning paths"
            icon={GraduationCap}
          />
          <MetricCard
            title="Lessons"
            value={counts.totalLessons}
            detail="Concepts and guided labs"
            icon={BookOpenCheck}
          />
          <MetricCard
            title="Completed"
            value={counts.completedProgress}
            detail="Demo learner progress"
            icon={CheckCircle2}
          />
          <MetricCard
            title="Total Companies"
            value={counts.totalCompanies}
            detail="Configured legal entities"
            icon={Building2}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
