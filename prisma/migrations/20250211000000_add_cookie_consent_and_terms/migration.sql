-- AlterTable
ALTER TABLE "User" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CookieConsentLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fingerprint" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CookieConsentLog_userId_idx" ON "CookieConsentLog"("userId");

-- CreateIndex
CREATE INDEX "CookieConsentLog_acceptedAt_idx" ON "CookieConsentLog"("acceptedAt");
