-- CreateTable
CREATE TABLE "CardBillingHistory" (
    "id" TEXT NOT NULL,
    "status" "CardBillingStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardBillingId" TEXT NOT NULL,
    "changedById" TEXT,

    CONSTRAINT "CardBillingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardBillingHistory_cardBillingId_idx" ON "CardBillingHistory"("cardBillingId");

-- CreateIndex
CREATE INDEX "CardBillingHistory_changedById_idx" ON "CardBillingHistory"("changedById");

-- CreateIndex
CREATE INDEX "CardBillingHistory_changedAt_idx" ON "CardBillingHistory"("changedAt");

-- AddForeignKey
ALTER TABLE "CardBillingHistory" ADD CONSTRAINT "CardBillingHistory_cardBillingId_fkey" FOREIGN KEY ("cardBillingId") REFERENCES "CardBilling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBillingHistory" ADD CONSTRAINT "CardBillingHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
