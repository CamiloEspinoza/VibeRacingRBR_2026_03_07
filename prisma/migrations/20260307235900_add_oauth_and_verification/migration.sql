-- AlterEnum: Add PENDING_VERIFICATION to SubStatus
ALTER TYPE "SubStatus" ADD VALUE 'PENDING_VERIFICATION';

-- DropIndex: old composite index with frequency
DROP INDEX IF EXISTS "Subscriber_status_frequency_idx";

-- AlterTable: Remove frequency, add verification + OAuth columns
ALTER TABLE "Subscriber"
    DROP COLUMN IF EXISTS "frequency",
    ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "verificationToken" TEXT,
    ADD COLUMN "verificationExpiry" TIMESTAMP(3),
    ADD COLUMN "linkedinAccessToken" TEXT,
    ADD COLUMN "linkedinUserId" TEXT,
    ADD COLUMN "linkedinTokenExpiry" TIMESTAMP(3),
    ADD COLUMN "xAccessToken" TEXT,
    ADD COLUMN "xRefreshToken" TEXT,
    ADD COLUMN "xUserId" TEXT,
    ADD COLUMN "xTokenExpiry" TIMESTAMP(3);

-- CreateIndex: unique on verificationToken
CREATE UNIQUE INDEX "Subscriber_verificationToken_key" ON "Subscriber"("verificationToken");

-- CreateIndex: new index on status only
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");

-- CreateIndex: index on verificationToken
CREATE INDEX "Subscriber_verificationToken_idx" ON "Subscriber"("verificationToken");

-- DropEnum: Frequency is no longer used
DROP TYPE IF EXISTS "Frequency";

-- CreateTable: OAuthState
CREATE TABLE "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeVerifier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique on OAuthState.state
CREATE UNIQUE INDEX "OAuthState_state_key" ON "OAuthState"("state");

-- CreateIndex: index on OAuthState.state
CREATE INDEX "OAuthState_state_idx" ON "OAuthState"("state");
