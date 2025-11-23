/*
  Warnings:

  - You are about to drop the column `closingDate` on the `CardBilling` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `CardBilling` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPayment` on the `CardBilling` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `CardBilling` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `CardBilling` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "CardBillingStatus" ADD VALUE 'CLOSED';

-- DropIndex
DROP INDEX "CardBilling_dueDate_idx";

-- AlterTable
ALTER TABLE "CardBilling" DROP COLUMN "closingDate",
DROP COLUMN "dueDate",
DROP COLUMN "minimumPayment",
DROP COLUMN "paidAmount",
DROP COLUMN "totalAmount",
ADD COLUMN     "paymentDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CardBilling_paymentDate_idx" ON "CardBilling"("paymentDate");
