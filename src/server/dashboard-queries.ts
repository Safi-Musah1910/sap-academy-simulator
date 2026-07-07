import { prisma } from "@/lib/prisma";

export async function getDashboardSummary() {
  const [totalCompanies, totalCustomers, totalVendors, totalGLAccounts, recentJournalEntries] =
    await Promise.all([
      prisma.company.count(),
      prisma.customer.count(),
      prisma.vendor.count(),
      prisma.gLAccount.count(),
      prisma.journalEntry.findMany({
        take: 10,
        include: {
          company: true,
          lines: {
            include: {
              glAccount: true,
            },
            orderBy: {
              lineNo: "asc",
            },
          },
        },
        orderBy: [
          {
            postingDate: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),
    ]);

  return {
    counts: {
      totalCompanies,
      totalCustomers,
      totalVendors,
      totalGLAccounts,
    },
    recentJournalEntries,
  };
}

export type RecentJournalEntry = Awaited<
  ReturnType<typeof getDashboardSummary>
>["recentJournalEntries"][number];
