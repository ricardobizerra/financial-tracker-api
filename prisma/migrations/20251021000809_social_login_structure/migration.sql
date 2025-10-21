-- CreateEnum
CREATE TYPE "AuthProviderName" AS ENUM ('GOOGLE');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AuthUserProvider" (
    "id" TEXT NOT NULL,
    "providerName" "AuthProviderName" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthUserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUserProvider_providerName_providerId_userId_key" ON "AuthUserProvider"("providerName", "providerId", "userId");

-- AddForeignKey
ALTER TABLE "AuthUserProvider" ADD CONSTRAINT "AuthUserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
