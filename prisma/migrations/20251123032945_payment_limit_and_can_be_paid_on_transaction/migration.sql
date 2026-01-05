-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'OVERDUE';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "canBePaid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "paymentLimit" TIMESTAMP(3);
