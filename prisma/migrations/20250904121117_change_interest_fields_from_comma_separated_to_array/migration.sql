/*
  Warnings:

  - You are about to drop the column `interest_field` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Group" DROP COLUMN "interest_field",
ADD COLUMN     "interest_fields" TEXT[];
