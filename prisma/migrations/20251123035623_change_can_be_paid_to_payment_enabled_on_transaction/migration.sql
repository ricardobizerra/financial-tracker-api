/*
  Warnings:

  - You are about to drop the column `canBePaid` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "canBePaid",
ADD COLUMN     "paymentEnabled" BOOLEAN NOT NULL DEFAULT true;
