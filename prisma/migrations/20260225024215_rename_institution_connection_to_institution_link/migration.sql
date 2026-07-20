/*
  Warnings:

  - You are about to drop the column `institutionConnectionId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `institutionConnectionId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `institutionConnectionId` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the `InstitutionConnection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[institutionLinkId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `institutionLinkId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionLinkId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionLinkId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_institutionConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_institutionConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "InstitutionConnection" DROP CONSTRAINT "InstitutionConnection_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "InstitutionConnection" DROP CONSTRAINT "InstitutionConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_institutionConnectionId_fkey";

-- DropIndex
DROP INDEX "Account_institutionConnectionId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "institutionConnectionId",
ADD COLUMN     "institutionLinkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "institutionConnectionId",
ADD COLUMN     "institutionLinkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "institutionConnectionId",
ADD COLUMN     "institutionLinkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "InstitutionConnection";

-- CreateTable
CREATE TABLE "InstitutionLink" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionLink_institutionId_userId_key" ON "InstitutionLink"("institutionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_institutionLinkId_key" ON "Account"("institutionLinkId");

-- AddForeignKey
ALTER TABLE "InstitutionLink" ADD CONSTRAINT "InstitutionLink_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionLink" ADD CONSTRAINT "InstitutionLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_institutionLinkId_fkey" FOREIGN KEY ("institutionLinkId") REFERENCES "InstitutionLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_institutionLinkId_fkey" FOREIGN KEY ("institutionLinkId") REFERENCES "InstitutionLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_institutionLinkId_fkey" FOREIGN KEY ("institutionLinkId") REFERENCES "InstitutionLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
