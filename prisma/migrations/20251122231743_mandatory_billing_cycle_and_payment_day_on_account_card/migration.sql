/*
  Warnings:

  - Made the column `billingCycleDay` on table `AccountCard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `billingPaymentDay` on table `AccountCard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AccountCard" ALTER COLUMN "billingCycleDay" SET NOT NULL,
ALTER COLUMN "billingPaymentDay" SET NOT NULL;
