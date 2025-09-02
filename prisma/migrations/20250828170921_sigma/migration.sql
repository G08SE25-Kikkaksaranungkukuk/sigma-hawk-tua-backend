-- CreateEnum
CREATE TYPE "public"."Interest" AS ENUM ('SEA', 'MOUNTAIN', 'WATERFALL', 'NATIONAL_PARK', 'ISLAND', 'TEMPLE', 'SHOPPING_MALL', 'MARKET', 'CAFE', 'HISTORICAL', 'AMUSEMENT_PARK', 'ZOO', 'FESTIVAL', 'MUSEUM', 'FOOD_STREET', 'BEACH_BAR', 'THEATRE');

-- CreateEnum
CREATE TYPE "public"."TravelStyle" AS ENUM ('BUDGET');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profile_url" TEXT,
    "social_credit" INTEGER NOT NULL DEFAULT 0,
    "interests" "public"."Interest"[],
    "travel_styles" "public"."TravelStyle"[],
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "group_id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "interest_field" TEXT,
    "group_leader_id" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "public"."RequestJoin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "RequestJoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "like" BOOLEAN,
    "dislike" BOOLEAN,
    "picture" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "place_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "place_type" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "picture_url" TEXT,
    "phone_num" TEXT,
    "social_media" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "public"."Itinerary" (
    "itinerary_id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("itinerary_id")
);

-- CreateTable
CREATE TABLE "public"."GroupItinerary" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "itinerary_id" INTEGER NOT NULL,

    CONSTRAINT "GroupItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Belongs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Belongs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_CreateEditItinerary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CreateEditItinerary_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "_Belongs_B_index" ON "public"."_Belongs"("B");

-- CreateIndex
CREATE INDEX "_CreateEditItinerary_B_index" ON "public"."_CreateEditItinerary"("B");

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_group_leader_id_fkey" FOREIGN KEY ("group_leader_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestJoin" ADD CONSTRAINT "RequestJoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestJoin" ADD CONSTRAINT "RequestJoin_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupItinerary" ADD CONSTRAINT "GroupItinerary_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupItinerary" ADD CONSTRAINT "GroupItinerary_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."Itinerary"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Belongs" ADD CONSTRAINT "_Belongs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Group"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Belongs" ADD CONSTRAINT "_Belongs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CreateEditItinerary" ADD CONSTRAINT "_CreateEditItinerary_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Itinerary"("itinerary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CreateEditItinerary" ADD CONSTRAINT "_CreateEditItinerary_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Place"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;
