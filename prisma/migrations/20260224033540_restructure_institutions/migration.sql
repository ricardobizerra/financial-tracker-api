/*
  Warnings:

  - You are about to drop the column `institutionId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountCardId` on the `CardBilling` table. All the data in the column will be lost.
  - You are about to drop the column `changedById` on the `CardBillingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `InvestmentTransaction` table. All the data in the column will be lost.
  - You are about to drop the `AccountCard` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[institutionConnectionId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cardId,periodStart]` on the table `CardBilling` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `institutionConnectionId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardId` to the `CardBilling` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AccountCard" DROP CONSTRAINT "AccountCard_accountId_fkey";

-- DropForeignKey
ALTER TABLE "CardBilling" DROP CONSTRAINT "CardBilling_accountCardId_fkey";

-- DropForeignKey
ALTER TABLE "CardBillingHistory" DROP CONSTRAINT "CardBillingHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentTransaction" DROP CONSTRAINT "InvestmentTransaction_accountId_fkey";

-- DropIndex
DROP INDEX "CardBilling_accountCardId_idx";

-- DropIndex
DROP INDEX "CardBilling_accountCardId_periodStart_key";

-- DropIndex
DROP INDEX "CardBillingHistory_changedById_idx";

-- DropIndex
DROP INDEX "InvestmentTransaction_accountId_idx";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "institutionId",
DROP COLUMN "userId",
ADD COLUMN     "institutionConnectionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CardBilling" DROP COLUMN "accountCardId",
ADD COLUMN     "cardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CardBillingHistory" DROP COLUMN "changedById";

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "accountId",
DROP COLUMN "userId",
ADD COLUMN     "institutionConnectionId" TEXT;

-- AlterTable
ALTER TABLE "InvestmentTransaction" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "sourceCardId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "sourceCardId" TEXT;

-- DropTable
DROP TABLE "AccountCard";

-- CreateTable
CREATE TABLE "InstitutionConnection" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "lastFourDigits" TEXT,
    "billingCycleDay" INTEGER NOT NULL,
    "billingPaymentDay" INTEGER NOT NULL,
    "type" "CardType" NOT NULL,
    "defaultLimit" DECIMAL(65,30) NOT NULL,
    "institutionConnectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionConnection_institutionId_userId_key" ON "InstitutionConnection"("institutionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_institutionConnectionId_key" ON "Account"("institutionConnectionId");

-- CreateIndex
CREATE INDEX "CardBilling_cardId_idx" ON "CardBilling"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardBilling_cardId_periodStart_key" ON "CardBilling"("cardId", "periodStart");

-- AddForeignKey
ALTER TABLE "InstitutionConnection" ADD CONSTRAINT "InstitutionConnection_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionConnection" ADD CONSTRAINT "InstitutionConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_institutionConnectionId_fkey" FOREIGN KEY ("institutionConnectionId") REFERENCES "InstitutionConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_institutionConnectionId_fkey" FOREIGN KEY ("institutionConnectionId") REFERENCES "InstitutionConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBilling" ADD CONSTRAINT "CardBilling_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_institutionConnectionId_fkey" FOREIGN KEY ("institutionConnectionId") REFERENCES "InstitutionConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sourceCardId_fkey" FOREIGN KEY ("sourceCardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_sourceCardId_fkey" FOREIGN KEY ("sourceCardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
