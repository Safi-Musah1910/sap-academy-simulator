const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedCurrencies() {
  await Promise.all(
    [
      { code: "USD", name: "US Dollar", symbol: "$" },
      { code: "GBP", name: "Pound Sterling", symbol: "£" },
      { code: "EUR", name: "Euro", symbol: "€" },
      { code: "CAD", name: "Canadian Dollar", symbol: "$" },
    ].map((currency) =>
      prisma.currency.upsert({
        where: { code: currency.code },
        update: currency,
        create: currency,
      }),
    ),
  );
}

async function seedFiscalYearVariants() {
  const k4 = await prisma.fiscalYearVariant.upsert({
    where: { code: "K4" },
    update: { name: "Calendar year, 12 periods", periods: 12, specialPeriods: 4 },
    create: { code: "K4", name: "Calendar year, 12 periods", periods: 12, specialPeriods: 4 },
  });

  const v3 = await prisma.fiscalYearVariant.upsert({
    where: { code: "V3" },
    update: { name: "April to March fiscal year", periods: 12, specialPeriods: 4 },
    create: { code: "V3", name: "April to March fiscal year", periods: 12, specialPeriods: 4 },
  });

  return { k4, v3 };
}

async function seedChartOfAccounts() {
  const chartOfAccounts = await prisma.chartOfAccounts.upsert({
    where: { code: "SACA" },
    update: { name: "SAP Academy Group Chart of Accounts", language: "EN" },
    create: { code: "SACA", name: "SAP Academy Group Chart of Accounts", language: "EN" },
  });

  const accountDefinitions = [
    ["100000", "Cash and Bank", "Asset", false],
    ["110000", "Trade Receivables", "Asset", true],
    ["160000", "Office Equipment", "Asset", false],
    ["200000", "Trade Payables", "Liability", true],
    ["300000", "Common Stock", "Equity", false],
    ["400000", "Training Revenue", "Revenue", false],
    ["500000", "Instructor Expense", "Expense", false],
    ["610000", "Cloud Subscription Expense", "Expense", false],
  ];

  const accounts = {};

  for (const [accountNumber, name, accountType, isReconciliation] of accountDefinitions) {
    accounts[accountNumber] = await prisma.gLAccount.upsert({
      where: {
        accountNumber_chartOfAccountsId: {
          accountNumber,
          chartOfAccountsId: chartOfAccounts.id,
        },
      },
      update: {
        name,
        accountType,
        isReconciliation,
      },
      create: {
        accountNumber,
        name,
        accountType,
        isReconciliation,
        chartOfAccountsId: chartOfAccounts.id,
      },
    });
  }

  return accounts;
}

async function seedCompanies({ k4, v3 }) {
  const companies = {};

  for (const company of [
    {
      code: "1000",
      name: "SAP Academy US Services",
      country: "US",
      currency: "USD",
      city: "New York",
      fiscalYearVariantId: k4.id,
    },
    {
      code: "2000",
      name: "SAP Academy UK Training",
      country: "GB",
      currency: "GBP",
      city: "London",
      fiscalYearVariantId: v3.id,
    },
    {
      code: "3000",
      name: "SAP Academy Germany Operations",
      country: "DE",
      currency: "EUR",
      city: "Walldorf",
      fiscalYearVariantId: k4.id,
    },
  ]) {
    companies[company.code] = await prisma.company.upsert({
      where: { code: company.code },
      update: company,
      create: company,
    });
  }

  return companies;
}

async function seedBusinessPartners(companies) {
  await Promise.all(
    [
      { number: "C10001", name: "Northwind Manufacturing", country: "US", city: "Chicago", email: "ap@northwind.example", companyId: companies["1000"].id },
      { number: "C20001", name: "Contoso Retail UK", country: "GB", city: "Manchester", email: "finance@contoso.example", companyId: companies["2000"].id },
      { number: "C30001", name: "Alpine Components GmbH", country: "DE", city: "Munich", email: "accounting@alpine.example", companyId: companies["3000"].id },
    ].map((customer) =>
      prisma.customer.upsert({
        where: { number: customer.number },
        update: customer,
        create: customer,
      }),
    ),
  );

  await Promise.all(
    [
      { number: "V10001", name: "BlueLine Cloud Services", country: "US", city: "Austin", email: "billing@blueline.example", companyId: companies["1000"].id },
      { number: "V20001", name: "LedgerWorks Consulting", country: "GB", city: "Bristol", email: "invoices@ledgerworks.example", companyId: companies["2000"].id },
      { number: "V30001", name: "Rhein Office Supplies", country: "DE", city: "Frankfurt", email: "finance@rhein.example", companyId: companies["3000"].id },
    ].map((vendor) =>
      prisma.vendor.upsert({
        where: { number: vendor.number },
        update: vendor,
        create: vendor,
      }),
    ),
  );
}

async function upsertJournalEntry({ documentNo, postingDate, documentDate, reference, headerText, companyId, lines }) {
  const existingEntry = await prisma.journalEntry.findUnique({
    where: { documentNo },
    select: { id: true },
  });

  if (existingEntry) {
    await prisma.journalLine.deleteMany({ where: { journalEntryId: existingEntry.id } });
  }

  return prisma.journalEntry.upsert({
    where: { documentNo },
    update: {
      postingDate,
      documentDate,
      reference,
      headerText,
      companyId,
      lines: {
        create: lines,
      },
    },
    create: {
      documentNo,
      postingDate,
      documentDate,
      reference,
      headerText,
      companyId,
      lines: {
        create: lines,
      },
    },
  });
}

async function seedJournalEntries(companies, accounts) {
  await upsertJournalEntry({
    documentNo: "4900000010",
    postingDate: new Date("2026-01-15"),
    documentDate: new Date("2026-01-15"),
    reference: "TRN-JAN-001",
    headerText: "Corporate academy subscription invoice",
    companyId: companies["1000"].id,
    lines: [
      { lineNo: 1, debit: 12500, credit: 0, text: "Customer receivable", glAccountId: accounts["110000"].id },
      { lineNo: 2, debit: 0, credit: 12500, text: "Training revenue", glAccountId: accounts["400000"].id },
    ],
  });

  await upsertJournalEntry({
    documentNo: "5100000042",
    postingDate: new Date("2026-02-03"),
    documentDate: new Date("2026-02-01"),
    reference: "INV-BL-2841",
    headerText: "Cloud lab environment hosting",
    companyId: companies["1000"].id,
    lines: [
      { lineNo: 1, debit: 4200, credit: 0, text: "Instructor and lab expense", glAccountId: accounts["500000"].id },
      { lineNo: 2, debit: 0, credit: 4200, text: "Vendor payable", glAccountId: accounts["200000"].id },
    ],
  });

  await upsertJournalEntry({
    documentNo: "1400000007",
    postingDate: new Date("2026-02-20"),
    documentDate: new Date("2026-02-20"),
    reference: "PAY-1000-07",
    headerText: "Customer payment received",
    companyId: companies["1000"].id,
    lines: [
      { lineNo: 1, debit: 12500, credit: 0, text: "Bank receipt", glAccountId: accounts["100000"].id },
      { lineNo: 2, debit: 0, credit: 12500, text: "Clear customer receivable", glAccountId: accounts["110000"].id },
    ],
  });
}

async function main() {
  await seedCurrencies();
  const fiscalYearVariants = await seedFiscalYearVariants();
  const accounts = await seedChartOfAccounts();
  const companies = await seedCompanies(fiscalYearVariants);

  await seedBusinessPartners(companies);
  await seedJournalEntries(companies, accounts);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
