/*
  Warnings:

  - You are about to drop the column `installmentNumber` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalInstallments` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "installmentNumber",
DROP COLUMN "totalInstallments";

-- CreateTable
CREATE TABLE "TransactionInstallment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "cardBillingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionInstallment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionInstallment" ADD CONSTRAINT "TransactionInstallment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionInstallment" ADD CONSTRAINT "TransactionInstallment_cardBillingId_fkey" FOREIGN KEY ("cardBillingId") REFERENCES "CardBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
