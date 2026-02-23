-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('FOOD_DINING', 'TRANSPORT', 'HOUSING', 'UTILITIES', 'HEALTHCARE', 'ENTERTAINMENT', 'SHOPPING', 'EDUCATION', 'TRAVEL', 'SALARY', 'INVESTMENT_INCOME', 'TRANSFER', 'OTHER');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "category" "TransactionCategory",
ADD COLUMN     "categoryConfidence" DOUBLE PRECISION;
