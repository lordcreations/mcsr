/*
  Warnings:

  - You are about to drop the column `userId` on the `rsg_plays` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `rsg_plays` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rsg_plays" DROP CONSTRAINT "rsg_plays_userId_fkey";

-- AlterTable
ALTER TABLE "rsg_plays" DROP COLUMN "userId",
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "userProfileId" TEXT;
