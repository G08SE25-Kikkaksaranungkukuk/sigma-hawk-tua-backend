/*
  Warnings:

  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `travel_styles` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupItinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Itinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestJoin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_group_leader_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupItinerary" DROP CONSTRAINT "GroupItinerary_group_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupItinerary" DROP CONSTRAINT "GroupItinerary_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Interaction" DROP CONSTRAINT "Interaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RequestJoin" DROP CONSTRAINT "RequestJoin_group_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RequestJoin" DROP CONSTRAINT "RequestJoin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."_Belongs" DROP CONSTRAINT "_Belongs_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CreateEditItinerary" DROP CONSTRAINT "_CreateEditItinerary_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CreateEditItinerary" DROP CONSTRAINT "_CreateEditItinerary_B_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "interests",
DROP COLUMN "travel_styles",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Group";

-- DropTable
DROP TABLE "public"."GroupItinerary";

-- DropTable
DROP TABLE "public"."Interaction";

-- DropTable
DROP TABLE "public"."Itinerary";

-- DropTable
DROP TABLE "public"."Place";

-- DropTable
DROP TABLE "public"."RequestJoin";

-- DropEnum
DROP TYPE "public"."Interest";

-- DropEnum
DROP TYPE "public"."TravelStyle";

-- CreateTable
CREATE TABLE "public"."interests" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."travel_styles" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_interests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_travel_styles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "travel_style_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_travel_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."groups" (
    "group_id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_leader_id" INTEGER NOT NULL,
    "description" TEXT,
    "max_members" INTEGER DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "public"."request_joins" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_joins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interactions" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "like" BOOLEAN,
    "dislike" BOOLEAN,
    "picture" TEXT,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."places" (
    "place_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "place_type" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "picture_url" TEXT,
    "phone_num" TEXT,
    "social_media" TEXT,
    "address" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "public"."itineraries" (
    "itinerary_id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("itinerary_id")
);

-- CreateTable
CREATE TABLE "public"."group_itineraries" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "itinerary_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_interests" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."place_interests" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interests_key_key" ON "public"."interests"("key");

-- CreateIndex
CREATE UNIQUE INDEX "travel_styles_key_key" ON "public"."travel_styles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_interests_user_id_interest_id_key" ON "public"."user_interests"("user_id", "interest_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_travel_styles_user_id_travel_style_id_key" ON "public"."user_travel_styles"("user_id", "travel_style_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_joins_user_id_group_id_key" ON "public"."request_joins"("user_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_itineraries_group_id_itinerary_id_key" ON "public"."group_itineraries"("group_id", "itinerary_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_interests_group_id_interest_id_key" ON "public"."group_interests"("group_id", "interest_id");

-- CreateIndex
CREATE UNIQUE INDEX "place_interests_place_id_interest_id_key" ON "public"."place_interests"("place_id", "interest_id");

-- AddForeignKey
ALTER TABLE "public"."user_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_interests" ADD CONSTRAINT "user_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_travel_styles" ADD CONSTRAINT "user_travel_styles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_travel_styles" ADD CONSTRAINT "user_travel_styles_travel_style_id_fkey" FOREIGN KEY ("travel_style_id") REFERENCES "public"."travel_styles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_group_leader_id_fkey" FOREIGN KEY ("group_leader_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_joins" ADD CONSTRAINT "request_joins_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_joins" ADD CONSTRAINT "request_joins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interactions" ADD CONSTRAINT "interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_itineraries" ADD CONSTRAINT "group_itineraries_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_itineraries" ADD CONSTRAINT "group_itineraries_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_interests" ADD CONSTRAINT "group_interests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_interests" ADD CONSTRAINT "group_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."place_interests" ADD CONSTRAINT "place_interests_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."place_interests" ADD CONSTRAINT "place_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Belongs" ADD CONSTRAINT "_Belongs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CreateEditItinerary" ADD CONSTRAINT "_CreateEditItinerary_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CreateEditItinerary" ADD CONSTRAINT "_CreateEditItinerary_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."places"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;
