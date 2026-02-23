/*
  Warnings:

  - A unique constraint covering the columns `[paymentTransactionId]` on the table `CardBilling` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CardBilling" ADD COLUMN     "paymentTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CardBilling_paymentTransactionId_key" ON "CardBilling"("paymentTransactionId");

-- AddForeignKey
ALTER TABLE "CardBilling" ADD CONSTRAINT "CardBilling_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
