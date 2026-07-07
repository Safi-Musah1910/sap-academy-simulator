const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.journalLine.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.gLAccount.deleteMany();
  await prisma.chartOfAccounts.deleteMany();
  await prisma.company.deleteMany();
  await prisma.fiscalYearVariant.deleteMany();

  const k4 = await prisma.fiscalYearVariant.create({
    data: { code: "K4", name: "Calendar year, 12 periods", periods: 12, specialPeriods: 4 },
  });
  const v3 = await prisma.fiscalYearVariant.create({
    data: { code: "V3", name: "April to March fiscal year", periods: 12, specialPeriods: 4 },
  });

  const groupCoa = await prisma.chartOfAccounts.create({
    data: { code: "SACA", name: "SAP Academy Group Chart of Accounts", language: "EN" },
  });

  const accounts = await Promise.all([
    ["100000", "Cash and Bank", "Asset", false],
    ["110000", "Trade Receivables", "Asset", true],
    ["160000", "Office Equipment", "Asset", false],
    ["200000", "Trade Payables", "Liability", true],
    ["300000", "Common Stock", "Equity", false],
    ["400000", "Training Revenue", "Revenue", false],
    ["500000", "Instructor Expense", "Expense", false],
    ["610000", "Cloud Subscription Expense", "Expense", false],
  ].map(([accountNumber, name, accountType, isReconciliation]) =>
    prisma.gLAccount.create({
      data: {
        accountNumber,
        name,
        accountType,
        isReconciliation,
        chartOfAccountsId: groupCoa.id,
      },
    }),
  ));

  const [cash, receivables, , payables, , revenue, instructorExpense] = accounts;

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        code: "1000",
        name: "SAP Academy US Services",
        country: "US",
        currency: "USD",
        city: "New York",
        fiscalYearVariantId: k4.id,
      },
    }),
    prisma.company.create({
      data: {
        code: "2000",
        name: "SAP Academy UK Training",
        country: "GB",
        currency: "GBP",
        city: "London",
        fiscalYearVariantId: v3.id,
      },
    }),
    prisma.company.create({
      data: {
        code: "3000",
        name: "SAP Academy Germany Operations",
        country: "DE",
        currency: "EUR",
        city: "Walldorf",
        fiscalYearVariantId: k4.id,
      },
    }),
  ]);

  await prisma.customer.createMany({
    data: [
      { number: "C10001", name: "Northwind Manufacturing", country: "US", city: "Chicago", email: "ap@northwind.example", companyId: companies[0].id },
      { number: "C20001", name: "Contoso Retail UK", country: "GB", city: "Manchester", email: "finance@contoso.example", companyId: companies[1].id },
      { number: "C30001", name: "Alpine Components GmbH", country: "DE", city: "Munich", email: "accounting@alpine.example", companyId: companies[2].id },
    ],
  });

  await prisma.vendor.createMany({
    data: [
      { number: "V10001", name: "BlueLine Cloud Services", country: "US", city: "Austin", email: "billing@blueline.example", companyId: companies[0].id },
      { number: "V20001", name: "LedgerWorks Consulting", country: "GB", city: "Bristol", email: "invoices@ledgerworks.example", companyId: companies[1].id },
      { number: "V30001", name: "Rhein Office Supplies", country: "DE", city: "Frankfurt", email: "finance@rhein.example", companyId: companies[2].id },
    ],
  });

  await prisma.journalEntry.create({
    data: {
      documentNo: "4900000010",
      postingDate: new Date("2026-01-15"),
      documentDate: new Date("2026-01-15"),
      reference: "TRN-JAN-001",
      headerText: "Corporate academy subscription invoice",
      companyId: companies[0].id,
      lines: {
        create: [
          { lineNo: 1, debit: 12500, credit: 0, text: "Customer receivable", glAccountId: receivables.id },
          { lineNo: 2, debit: 0, credit: 12500, text: "Training revenue", glAccountId: revenue.id },
        ],
      },
    },
  });

  await prisma.journalEntry.create({
    data: {
      documentNo: "5100000042",
      postingDate: new Date("2026-02-03"),
      documentDate: new Date("2026-02-01"),
      reference: "INV-BL-2841",
      headerText: "Cloud lab environment hosting",
      companyId: companies[0].id,
      lines: {
        create: [
          { lineNo: 1, debit: 4200, credit: 0, text: "Instructor and lab expense", glAccountId: instructorExpense.id },
          { lineNo: 2, debit: 0, credit: 4200, text: "Vendor payable", glAccountId: payables.id },
        ],
      },
    },
  });

  await prisma.journalEntry.create({
    data: {
      documentNo: "1400000007",
      postingDate: new Date("2026-02-20"),
      documentDate: new Date("2026-02-20"),
      reference: "PAY-1000-07",
      headerText: "Customer payment received",
      companyId: companies[0].id,
      lines: {
        create: [
          { lineNo: 1, debit: 12500, credit: 0, text: "Bank receipt", glAccountId: cash.id },
          { lineNo: 2, debit: 0, credit: 12500, text: "Clear customer receivable", glAccountId: receivables.id },
        ],
      },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
