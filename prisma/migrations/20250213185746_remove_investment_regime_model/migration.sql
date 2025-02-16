/*
  Warnings:

  - You are about to drop the `InvestmentRegime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `regimeName` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InvestmentRegime" DROP CONSTRAINT "InvestmentRegime_investmentId_fkey";

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "regimeName" "Regime" NOT NULL,
ADD COLUMN     "regimePercentage" DOUBLE PRECISION DEFAULT 100;

-- DropTable
DROP TABLE "InvestmentRegime";
