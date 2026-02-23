-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "CardBillingStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "cardBillingId" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PIX';

-- CreateTable
CREATE TABLE "AccountCard" (
    "id" TEXT NOT NULL,
    "lastFourDigits" TEXT,
    "billingCycleDay" INTEGER,
    "type" "CardType" NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBilling" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minimumPayment" DECIMAL(65,30),
    "status" "CardBillingStatus" NOT NULL,
    "accountCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardBilling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountCard_accountId_key" ON "AccountCard"("accountId");

-- CreateIndex
CREATE INDEX "CardBilling_accountCardId_idx" ON "CardBilling"("accountCardId");

-- CreateIndex
CREATE INDEX "CardBilling_dueDate_idx" ON "CardBilling"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "CardBilling_accountCardId_periodStart_key" ON "CardBilling"("accountCardId", "periodStart");

-- AddForeignKey
ALTER TABLE "AccountCard" ADD CONSTRAINT "AccountCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBilling" ADD CONSTRAINT "CardBilling_accountCardId_fkey" FOREIGN KEY ("accountCardId") REFERENCES "AccountCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cardBillingId_fkey" FOREIGN KEY ("cardBillingId") REFERENCES "CardBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
