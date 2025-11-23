/*
  Warnings:

  - You are about to drop the column `closingDate` on the `CardBilling` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountCard" ADD COLUMN     "billingPaymentDay" INTEGER;

-- AlterTable
ALTER TABLE "CardBilling" DROP COLUMN "closingDate";
