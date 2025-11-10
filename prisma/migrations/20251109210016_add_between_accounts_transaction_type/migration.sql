-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'BETWEEN_ACCOUNTS');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'INCOME';
