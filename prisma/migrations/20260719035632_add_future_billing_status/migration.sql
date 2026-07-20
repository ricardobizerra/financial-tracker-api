-- AlterEnum
ALTER TYPE "CardBillingStatus" ADD VALUE 'FUTURE';

COMMIT;

-- Safe transition for existing future statements
UPDATE "CardBilling"
SET "status" = 'FUTURE'
WHERE "status" = 'PENDING'
  AND "periodStart" > CURRENT_DATE;


