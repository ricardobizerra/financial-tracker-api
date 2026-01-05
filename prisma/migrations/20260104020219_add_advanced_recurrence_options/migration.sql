-- CreateEnum
CREATE TYPE "DayMode" AS ENUM ('SPECIFIC_DAY', 'LAST_DAY', 'LAST_BUSINESS_DAY', 'FIRST_BUSINESS_DAY', 'NTH_WEEKDAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RecurrenceFrequency" ADD VALUE 'WEEKLY';
ALTER TYPE "RecurrenceFrequency" ADD VALUE 'BI_WEEKLY';

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "dayMode" "DayMode" NOT NULL DEFAULT 'SPECIFIC_DAY',
ADD COLUMN     "dayOfWeek" INTEGER,
ADD COLUMN     "weekOfMonth" INTEGER,
ALTER COLUMN "dayOfMonth" DROP NOT NULL;
