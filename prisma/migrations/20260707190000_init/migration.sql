PRAGMA foreign_keys=OFF;

CREATE TABLE "FiscalYearVariant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "periods" INTEGER NOT NULL,
  "specialPeriods" INTEGER NOT NULL DEFAULT 4,
  "yearDependent" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "Company" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Active',
  "fiscalYearVariantId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Company_fiscalYearVariantId_fkey" FOREIGN KEY ("fiscalYearVariantId") REFERENCES "FiscalYearVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "ChartOfAccounts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'EN'
);

CREATE TABLE "GLAccount" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountNumber" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "accountType" TEXT NOT NULL,
  "isReconciliation" BOOLEAN NOT NULL DEFAULT false,
  "chartOfAccountsId" TEXT NOT NULL,
  CONSTRAINT "GLAccount_chartOfAccountsId_fkey" FOREIGN KEY ("chartOfAccountsId") REFERENCES "ChartOfAccounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "email" TEXT,
  "companyId" TEXT NOT NULL,
  CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Vendor" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "email" TEXT,
  "companyId" TEXT NOT NULL,
  CONSTRAINT "Vendor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "JournalEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "documentNo" TEXT NOT NULL,
  "postingDate" DATETIME NOT NULL,
  "documentDate" DATETIME NOT NULL,
  "reference" TEXT,
  "headerText" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "JournalEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "JournalLine" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "lineNo" INTEGER NOT NULL,
  "debit" REAL NOT NULL DEFAULT 0,
  "credit" REAL NOT NULL DEFAULT 0,
  "text" TEXT NOT NULL,
  "journalEntryId" TEXT NOT NULL,
  "glAccountId" TEXT NOT NULL,
  CONSTRAINT "JournalLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JournalLine_glAccountId_fkey" FOREIGN KEY ("glAccountId") REFERENCES "GLAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "FiscalYearVariant_code_key" ON "FiscalYearVariant"("code");
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");
CREATE UNIQUE INDEX "ChartOfAccounts_code_key" ON "ChartOfAccounts"("code");
CREATE UNIQUE INDEX "GLAccount_accountNumber_chartOfAccountsId_key" ON "GLAccount"("accountNumber", "chartOfAccountsId");
CREATE UNIQUE INDEX "Customer_number_key" ON "Customer"("number");
CREATE UNIQUE INDEX "Vendor_number_key" ON "Vendor"("number");
CREATE UNIQUE INDEX "JournalEntry_documentNo_key" ON "JournalEntry"("documentNo");

PRAGMA foreign_keys=ON;
