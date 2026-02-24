/*
  Warnings:

  - Made the column `institutionConnectionId` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_institutionConnectionId_fkey";

-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "institutionConnectionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_institutionConnectionId_fkey" FOREIGN KEY ("institutionConnectionId") REFERENCES "InstitutionConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
