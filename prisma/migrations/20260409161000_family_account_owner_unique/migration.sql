DROP INDEX IF EXISTS "FamilyAccount_ownerId_idx";
CREATE UNIQUE INDEX "FamilyAccount_ownerId_key" ON "FamilyAccount"("ownerId");
