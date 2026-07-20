-- Migration: Replace CANCELED status with deletedAt soft delete
-- Step 1: Add deleted_at column to Transaction
ALTER TABLE "Transaction" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Step 2: Backfill deletedAt and status for existing CANCELED rows
-- Rule: past-dated → COMPLETED, today/future-dated → PLANNED (no OVERDUE for intentionally canceled rows)
UPDATE "Transaction"
SET
  "deletedAt" = "updatedAt",
  "status" = CASE
    WHEN "date" < CURRENT_DATE THEN 'COMPLETED'::"TransactionStatus"
    ELSE 'PLANNED'::"TransactionStatus"
  END
WHERE "status" = 'CANCELED'::"TransactionStatus";

-- Step 3: Create index on deletedAt for performance
CREATE INDEX "Transaction_deletedAt_idx" ON "Transaction"("deletedAt");

-- Step 4: Remove CANCELED from the TransactionStatus enum
-- PostgreSQL does not support DROP VALUE from an enum natively,
-- so we rename the old type, create a new one without CANCELED, cast, then drop the old one.
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";

CREATE TYPE "TransactionStatus" AS ENUM ('PLANNED', 'COMPLETED', 'OVERDUE');

ALTER TABLE "Transaction"
  ALTER COLUMN "status" TYPE "TransactionStatus"
    USING "status"::text::"TransactionStatus";

DROP TYPE "TransactionStatus_old";
