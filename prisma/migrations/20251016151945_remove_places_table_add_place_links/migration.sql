/*
  Warnings:

  - You are about to drop the `itinerary_places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `place_interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."itinerary_places" DROP CONSTRAINT "itinerary_places_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."place_interests" DROP CONSTRAINT "place_interests_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."place_interests" DROP CONSTRAINT "place_interests_place_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" ADD COLUMN     "place_links" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."itinerary_places";

-- DropTable
DROP TABLE "public"."place_interests";

-- DropTable
DROP TABLE "public"."places";
