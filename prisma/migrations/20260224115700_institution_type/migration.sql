/*
  Warnings:

  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - The `types` column on the `Institution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('CHECKING', 'INVESTMENT', 'CARD');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "types",
ADD COLUMN     "types" "InstitutionType"[];

-- DropEnum
DROP TYPE "AccountType";
