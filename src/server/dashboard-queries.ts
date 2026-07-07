import { logDatabaseFallback } from "@/lib/database-state";
import { prisma } from "@/lib/prisma";

export async function getDashboardSummary() {
  try {
    const [
      totalCompanies,
      totalCustomers,
      totalVendors,
      totalGLAccounts,
      totalCourses,
      totalLessons,
      completedProgress,
      recentJournalEntries,
    ] =
      await Promise.all([
        prisma.company.count(),
        prisma.customer.count(),
        prisma.vendor.count(),
        prisma.gLAccount.count(),
        prisma.course.count(),
        prisma.lesson.count(),
        prisma.learnerProgress.count({
          where: {
            learnerId: "demo",
            status: "Completed",
          },
        }),
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
        totalCourses,
        totalLessons,
        completedProgress,
      },
      recentJournalEntries,
    };
  } catch (error) {
    logDatabaseFallback("dashboard summary", error);

    return {
      counts: {
        totalCompanies: 0,
        totalCustomers: 0,
        totalVendors: 0,
        totalGLAccounts: 0,
        totalCourses: 0,
        totalLessons: 0,
        completedProgress: 0,
      },
      recentJournalEntries: [],
    };
  }
}

export type RecentJournalEntry = Awaited<
  ReturnType<typeof getDashboardSummary>
>["recentJournalEntries"][number];
