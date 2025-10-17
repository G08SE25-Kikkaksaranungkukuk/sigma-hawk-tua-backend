/*
  Warnings:

  - You are about to drop the `place_interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CreateEditItinerary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_CreateEditItinerary" DROP CONSTRAINT IF EXISTS "_CreateEditItinerary_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CreateEditItinerary" DROP CONSTRAINT IF EXISTS "_CreateEditItinerary_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."place_interests" DROP CONSTRAINT "place_interests_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."place_interests" DROP CONSTRAINT "place_interests_place_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" ADD COLUMN     "place_links" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE IF EXISTS "public"."_CreateEditItinerary";

-- DropTable
DROP TABLE "public"."place_interests";

-- DropTable
DROP TABLE "public"."places";
