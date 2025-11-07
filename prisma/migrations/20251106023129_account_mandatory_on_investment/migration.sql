/*
  Warnings:

  - Made the column `accountId` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "accountId" SET NOT NULL;
