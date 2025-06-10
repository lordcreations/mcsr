/*
  Warnings:

  - Changed the type of `time` on the `rsg_plays` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "rsg_plays" DROP COLUMN "time",
ADD COLUMN     "time" DOUBLE PRECISION NOT NULL;
