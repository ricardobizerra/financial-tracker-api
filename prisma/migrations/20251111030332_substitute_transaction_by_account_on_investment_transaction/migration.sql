/*
  Warnings:

  - You are about to drop the column `transactionId` on the `InvestmentTransaction` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `InvestmentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InvestmentTransaction" DROP CONSTRAINT "InvestmentTransaction_transactionId_fkey";

-- DropIndex
DROP INDEX "InvestmentTransaction_transactionId_idx";

-- AlterTable
ALTER TABLE "InvestmentTransaction" DROP COLUMN "transactionId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "InvestmentTransaction_accountId_idx" ON "InvestmentTransaction"("accountId");

-- AddForeignKey
ALTER TABLE "InvestmentTransaction" ADD CONSTRAINT "InvestmentTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
