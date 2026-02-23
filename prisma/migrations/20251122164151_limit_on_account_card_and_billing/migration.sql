-- AlterTable
ALTER TABLE "AccountCard" ADD COLUMN     "defaultLimit" DECIMAL(65,30) NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "CardBilling" ADD COLUMN     "limit" DECIMAL(65,30) NOT NULL DEFAULT 100;
