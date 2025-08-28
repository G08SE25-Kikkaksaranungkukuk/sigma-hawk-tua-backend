/*
  Warnings:

  - You are about to drop the column `interest` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."Interest" ADD VALUE 'THEATRE';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "interest",
ADD COLUMN     "interests" "public"."Interest"[];
