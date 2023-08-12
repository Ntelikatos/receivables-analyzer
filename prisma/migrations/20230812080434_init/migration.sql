-- CreateTable
CREATE TABLE "Receivable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "openingValue" REAL NOT NULL,
    "paidValue" REAL NOT NULL,
    "dueDate" TEXT NOT NULL,
    "closedDate" TEXT,
    "cancelled" BOOLEAN,
    "debtorName" TEXT NOT NULL,
    "debtorReference" TEXT NOT NULL,
    "debtorAddress1" TEXT,
    "debtorAddress2" TEXT,
    "debtorTown" TEXT,
    "debtorState" TEXT,
    "debtorZip" TEXT,
    "debtorCountryCode" TEXT NOT NULL,
    "debtorRegistrationNumber" TEXT
);
