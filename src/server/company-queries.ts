import { logDatabaseFallback } from "@/lib/database-state";
import { prisma } from "@/lib/prisma";

export async function getCompanyCodeMaintenanceData() {
  try {
    const [companies, variants] = await Promise.all([
      prisma.company.findMany({
        include: { fiscalYearVariant: true },
        orderBy: { code: "asc" },
      }),
      prisma.fiscalYearVariant.findMany({ orderBy: { code: "asc" } }),
    ]);

    return { companies, variants, isDatabaseReady: true };
  } catch (error) {
    logDatabaseFallback("company code maintenance", error);

    return { companies: [], variants: [], isDatabaseReady: false };
  }
}

export type CompanyCodeRecord = Awaited<
  ReturnType<typeof getCompanyCodeMaintenanceData>
>["companies"][number];
