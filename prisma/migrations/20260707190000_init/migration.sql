CREATE TABLE "Currency" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,

  CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FiscalYearVariant" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "periods" INTEGER NOT NULL,
  "specialPeriods" INTEGER NOT NULL DEFAULT 4,
  "yearDependent" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "FiscalYearVariant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Active',
  "fiscalYearVariantId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChartOfAccounts" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'EN',

  CONSTRAINT "ChartOfAccounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GLAccount" (
  "id" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "accountType" TEXT NOT NULL,
  "isReconciliation" BOOLEAN NOT NULL DEFAULT false,
  "chartOfAccountsId" TEXT NOT NULL,

  CONSTRAINT "GLAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "email" TEXT,
  "companyId" TEXT NOT NULL,

  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Vendor" (
  "id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "email" TEXT,
  "companyId" TEXT NOT NULL,

  CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JournalEntry" (
  "id" TEXT NOT NULL,
  "documentNo" TEXT NOT NULL,
  "postingDate" TIMESTAMP(3) NOT NULL,
  "documentDate" TIMESTAMP(3) NOT NULL,
  "reference" TEXT,
  "headerText" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JournalLine" (
  "id" TEXT NOT NULL,
  "lineNo" INTEGER NOT NULL,
  "debit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "text" TEXT NOT NULL,
  "journalEntryId" TEXT NOT NULL,
  "glAccountId" TEXT NOT NULL,

  CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");
CREATE UNIQUE INDEX "FiscalYearVariant_code_key" ON "FiscalYearVariant"("code");
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");
CREATE UNIQUE INDEX "ChartOfAccounts_code_key" ON "ChartOfAccounts"("code");
CREATE UNIQUE INDEX "GLAccount_accountNumber_chartOfAccountsId_key" ON "GLAccount"("accountNumber", "chartOfAccountsId");
CREATE UNIQUE INDEX "Customer_number_key" ON "Customer"("number");
CREATE UNIQUE INDEX "Vendor_number_key" ON "Vendor"("number");
CREATE UNIQUE INDEX "JournalEntry_documentNo_key" ON "JournalEntry"("documentNo");

ALTER TABLE "Company" ADD CONSTRAINT "Company_currency_fkey" FOREIGN KEY ("currency") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Company" ADD CONSTRAINT "Company_fiscalYearVariantId_fkey" FOREIGN KEY ("fiscalYearVariantId") REFERENCES "FiscalYearVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GLAccount" ADD CONSTRAINT "GLAccount_chartOfAccountsId_fkey" FOREIGN KEY ("chartOfAccountsId") REFERENCES "ChartOfAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_glAccountId_fkey" FOREIGN KEY ("glAccountId") REFERENCES "GLAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
