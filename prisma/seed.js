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

async function seedLearningPlatform() {
  const course = await prisma.course.upsert({
    where: { slug: "sap-fico-foundations" },
    update: {
      title: "SAP FICO Foundations",
      description:
        "A complete learning path for SAP Financial Accounting and Controlling fundamentals, configuration, postings, reporting, and close activities.",
      track: "SAP FICO",
      level: "Beginner to Consultant",
      status: "Published",
      sequence: 1,
    },
    create: {
      slug: "sap-fico-foundations",
      title: "SAP FICO Foundations",
      description:
        "A complete learning path for SAP Financial Accounting and Controlling fundamentals, configuration, postings, reporting, and close activities.",
      track: "SAP FICO",
      level: "Beginner to Consultant",
      status: "Published",
      sequence: 1,
    },
  });

  const moduleDefinitions = [
    {
      slug: "sap-gui-and-navigation",
      title: "SAP GUI and Navigation",
      description: "Understand clients, SIDs, logon entries, sessions, and how users reach SAP systems.",
      sequence: 1,
      estimatedMinutes: 45,
      lessons: [
        {
          slug: "sap-gui-reference-introduction",
          title: "SAP GUI Reference Mode",
          summary: "Learn how SAP-style connection entries are structured.",
          plainEnglish:
            "SAP GUI is a front door into SAP systems. A connection entry tells the user which system, server, and route to use.",
          businessNote:
            "Correct logon selection keeps training, testing, and production activity separated, which protects real business data.",
          interactiveRoute: "/sap-gui-reference",
          sequence: 1,
          durationMinutes: 15,
        },
      ],
      tasks: [
        {
          slug: "select-s4hana-system",
          title: "Select the S/4HANA system and click Log On",
          mode: "Practice",
          description: "Identify the S/4HANA training system from the connection list and launch the simulated logon.",
          expectedOutcome: "The learner selects SID S4A and receives a successful logon confirmation.",
          sequence: 1,
        },
      ],
      questions: [
        {
          prompt: "What does SID identify in an SAP landscape?",
          optionsJson: JSON.stringify(["The system", "The currency", "The company code", "The fiscal period"]),
          correctAnswer: "The system",
          explanation: "SID is the System ID, such as DEV, QAS, PRD, or S4A.",
          sequence: 1,
        },
      ],
    },
    {
      slug: "enterprise-structure",
      title: "Enterprise Structure",
      description: "Configure company codes, fiscal year variants, currencies, and charts of accounts.",
      sequence: 2,
      estimatedMinutes: 90,
      lessons: [
        {
          slug: "company-code-basics",
          title: "Company Code Basics",
          summary: "Understand the legal entity used for financial statements.",
          plainEnglish:
            "A company code is the smallest organizational unit for external accounting. It owns ledgers, currencies, and financial statements.",
          businessNote:
            "Auditors and finance teams report statutory results by company code, so setup accuracy affects compliance.",
          interactiveRoute: "/company-code",
          sequence: 1,
          durationMinutes: 20,
        },
        {
          slug: "fiscal-year-variant-basics",
          title: "Fiscal Year Variants",
          summary: "Learn how posting periods and special periods are organized.",
          plainEnglish:
            "A fiscal year variant defines how the year is split into accounting periods and close adjustment periods.",
          businessNote:
            "Period control supports month-end and year-end closing discipline across finance teams.",
          interactiveRoute: null,
          sequence: 2,
          durationMinutes: 20,
        },
      ],
      tasks: [
        {
          slug: "create-training-company-code",
          title: "Create a training company code",
          mode: "Practice",
          description: "Create a four-character company code with ISO country and currency values.",
          expectedOutcome: "A valid company code exists and appears on the dashboard counts.",
          sequence: 1,
        },
      ],
      questions: [
        {
          prompt: "Why is a company code important in SAP FI?",
          optionsJson: JSON.stringify([
            "It defines a legal accounting entity",
            "It stores user passwords",
            "It replaces the chart of accounts",
            "It controls screen colors",
          ]),
          correctAnswer: "It defines a legal accounting entity",
          explanation: "Company codes are used for statutory reporting and external accounting.",
          sequence: 1,
        },
      ],
    },
    {
      slug: "general-ledger-accounting",
      title: "General Ledger Accounting",
      description: "Maintain G/L master data, reconciliation accounts, journal entries, and trial balances.",
      sequence: 3,
      estimatedMinutes: 120,
      lessons: [
        {
          slug: "gl-account-master-data",
          title: "G/L Account Master Data",
          summary: "Learn account numbers, account types, and reconciliation indicators.",
          plainEnglish:
            "A G/L account is a bucket for financial values such as cash, receivables, revenue, and expenses.",
          businessNote:
            "Clean account design makes reporting reliable and reduces manual corrections during close.",
          interactiveRoute: null,
          sequence: 1,
          durationMinutes: 30,
        },
      ],
      tasks: [
        {
          slug: "review-training-chart-of-accounts",
          title: "Review the training chart of accounts",
          mode: "Challenge",
          description: "Identify asset, liability, revenue, and expense accounts from the seeded chart.",
          expectedOutcome: "The learner can classify core G/L accounts from memory.",
          sequence: 1,
        },
      ],
      questions: [
        {
          prompt: "Which account type is normally used for Training Revenue?",
          optionsJson: JSON.stringify(["Revenue", "Asset", "Liability", "Vendor"]),
          correctAnswer: "Revenue",
          explanation: "Training Revenue records income earned from training services.",
          sequence: 1,
        },
      ],
    },
    {
      slug: "accounts-payable",
      title: "Accounts Payable",
      description: "Learn vendor master data, vendor invoices, outgoing payments, and payables reporting.",
      sequence: 4,
      estimatedMinutes: 90,
      lessons: [
        {
          slug: "vendor-invoice-flow",
          title: "Vendor Invoice Flow",
          summary: "Understand how expenses and vendor liabilities are posted.",
          plainEnglish:
            "A vendor invoice records what the company owes. It usually debits an expense or asset and credits a payable.",
          businessNote:
            "Timely AP processing protects supplier relationships and cash-flow planning.",
          interactiveRoute: null,
          sequence: 1,
          durationMinutes: 25,
        },
      ],
      tasks: [
        {
          slug: "interpret-vendor-payable-entry",
          title: "Interpret a vendor payable journal entry",
          mode: "Practice",
          description: "Review the seeded cloud hosting invoice and identify the debit and credit lines.",
          expectedOutcome: "The learner explains why expense is debited and payables are credited.",
          sequence: 1,
        },
      ],
      questions: [],
    },
    {
      slug: "accounts-receivable",
      title: "Accounts Receivable",
      description: "Learn customer master data, invoices, incoming payments, and receivables clearing.",
      sequence: 5,
      estimatedMinutes: 90,
      lessons: [
        {
          slug: "customer-invoice-and-payment",
          title: "Customer Invoice and Payment",
          summary: "Understand how receivables are created and cleared.",
          plainEnglish:
            "A customer invoice creates an amount due from a customer. A payment clears that receivable against bank cash.",
          businessNote:
            "AR accuracy directly affects cash visibility, credit management, and customer statements.",
          interactiveRoute: null,
          sequence: 1,
          durationMinutes: 25,
        },
      ],
      tasks: [
        {
          slug: "trace-customer-payment",
          title: "Trace a customer payment",
          mode: "Practice",
          description: "Follow the seeded customer invoice and payment entries through receivables and cash.",
          expectedOutcome: "The learner can explain receivable creation and clearing.",
          sequence: 1,
        },
      ],
      questions: [],
    },
    {
      slug: "period-end-close",
      title: "Period-End Close and Reporting",
      description: "Practice close concepts, trial balance review, financial statements, and reporting checks.",
      sequence: 6,
      estimatedMinutes: 120,
      lessons: [
        {
          slug: "trial-balance-review",
          title: "Trial Balance Review",
          summary: "Learn how finance teams validate debit and credit balances.",
          plainEnglish:
            "A trial balance lists accounts and balances so accountants can review whether postings are complete and reasonable.",
          businessNote:
            "Close quality depends on early variance review, account ownership, and disciplined corrections.",
          interactiveRoute: null,
          sequence: 1,
          durationMinutes: 30,
        },
      ],
      tasks: [
        {
          slug: "month-end-readiness-check",
          title: "Run a month-end readiness check",
          mode: "Challenge",
          description: "Review company codes, open postings, and key accounts before reporting.",
          expectedOutcome: "The learner identifies close readiness risks from training data.",
          sequence: 1,
        },
      ],
      questions: [],
    },
  ];

  for (const moduleDefinition of moduleDefinitions) {
    const moduleRecord = await prisma.trainingModule.upsert({
      where: { slug: moduleDefinition.slug },
      update: {
        title: moduleDefinition.title,
        description: moduleDefinition.description,
        sequence: moduleDefinition.sequence,
        estimatedMinutes: moduleDefinition.estimatedMinutes,
        courseId: course.id,
      },
      create: {
        slug: moduleDefinition.slug,
        title: moduleDefinition.title,
        description: moduleDefinition.description,
        sequence: moduleDefinition.sequence,
        estimatedMinutes: moduleDefinition.estimatedMinutes,
        courseId: course.id,
      },
    });

    for (const lesson of moduleDefinition.lessons) {
      await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: { ...lesson, moduleId: moduleRecord.id },
        create: { ...lesson, moduleId: moduleRecord.id },
      });
    }

    for (const task of moduleDefinition.tasks) {
      await prisma.practiceTask.upsert({
        where: { slug: task.slug },
        update: { ...task, moduleId: moduleRecord.id },
        create: { ...task, moduleId: moduleRecord.id },
      });
    }

    await prisma.quizQuestion.deleteMany({ where: { moduleId: moduleRecord.id } });
    for (const question of moduleDefinition.questions) {
      await prisma.quizQuestion.create({
        data: { ...question, moduleId: moduleRecord.id },
      });
    }
  }

  const firstLessons = await prisma.lesson.findMany({
    where: {
      slug: {
        in: ["sap-gui-reference-introduction", "company-code-basics"],
      },
    },
  });

  for (const lesson of firstLessons) {
    await prisma.learnerProgress.upsert({
      where: { progressKey: `demo:lesson:${lesson.slug}` },
      update: {
        learnerId: "demo",
        status: "Completed",
        score: 100,
        completedAt: new Date("2026-03-01"),
        lessonId: lesson.id,
      },
      create: {
        learnerId: "demo",
        progressKey: `demo:lesson:${lesson.slug}`,
        status: "Completed",
        score: 100,
        completedAt: new Date("2026-03-01"),
        lessonId: lesson.id,
      },
    });
  }

  const firstTask = await prisma.practiceTask.findUnique({
    where: { slug: "select-s4hana-system" },
  });

  if (firstTask) {
    await prisma.learnerProgress.upsert({
      where: { progressKey: `demo:task:${firstTask.slug}` },
      update: {
        learnerId: "demo",
        status: "Completed",
        score: 100,
        completedAt: new Date("2026-03-01"),
        taskId: firstTask.id,
      },
      create: {
        learnerId: "demo",
        progressKey: `demo:task:${firstTask.slug}`,
        status: "Completed",
        score: 100,
        completedAt: new Date("2026-03-01"),
        taskId: firstTask.id,
      },
    });
  }
}

async function main() {
  await seedCurrencies();
  const fiscalYearVariants = await seedFiscalYearVariants();
  const accounts = await seedChartOfAccounts();
  const companies = await seedCompanies(fiscalYearVariants);

  await seedBusinessPartners(companies);
  await seedJournalEntries(companies, accounts);
  await seedLearningPlatform();
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
