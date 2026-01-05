-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('PERIODIC', 'INSTALLMENT');

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "recurrenceType" "RecurrenceType" NOT NULL DEFAULT 'PERIODIC',
ADD COLUMN     "totalInstallments" INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "installmentNumber" INTEGER,
ADD COLUMN     "totalInstallments" INTEGER;
