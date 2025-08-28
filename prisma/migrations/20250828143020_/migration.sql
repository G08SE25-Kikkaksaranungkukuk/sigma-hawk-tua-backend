/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TravelStyle" AS ENUM ('BUDGET');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "travel_styles" "public"."TravelStyle"[];

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
