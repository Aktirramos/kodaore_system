-- CreateTable
CREATE TABLE "OpsAlertState" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsAlertState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpsAlertState_key_key" ON "OpsAlertState"("key");

-- CreateIndex
CREATE INDEX "OpsAlertState_updatedAt_idx" ON "OpsAlertState"("updatedAt");
