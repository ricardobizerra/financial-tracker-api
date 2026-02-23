/*
  Warnings:

  - Added the required column `installmentNumber` to the `TransactionInstallment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionInstallment" ADD COLUMN     "installmentNumber" INTEGER NOT NULL;
