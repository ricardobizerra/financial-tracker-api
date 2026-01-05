/*
  Warnings:

  - You are about to drop the column `balance` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "balance",
ADD COLUMN     "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0;
