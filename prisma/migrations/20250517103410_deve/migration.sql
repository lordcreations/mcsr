-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_uuid_key" ON "user_profiles"("uuid");
