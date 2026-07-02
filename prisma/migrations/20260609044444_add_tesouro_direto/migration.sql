-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('FIXED_INCOME', 'TREASURY', 'SAVINGS', 'VARIABLE_INCOME');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Regime" ADD VALUE 'SELIC';
ALTER TYPE "Regime" ADD VALUE 'IPCA';
ALTER TYPE "Regime" ADD VALUE 'PREFIXED';

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "brokerageFee" DOUBLE PRECISION,
ADD COLUMN     "fixedRate" DOUBLE PRECISION,
ADD COLUMN     "maturityDate" TIMESTAMP(3),
ADD COLUMN     "type" "InvestmentType" NOT NULL DEFAULT 'FIXED_INCOME';

-- Custom Data Migration: Explicitly map all existing regimes to their correct types
UPDATE "Investment" SET "type" = 'FIXED_INCOME' WHERE "regimeName" = 'CDI';
UPDATE "Investment" SET "type" = 'SAVINGS' WHERE "regimeName" = 'POUPANCA';
