-- DropForeignKey
ALTER TABLE "public"."travel_history" DROP CONSTRAINT "travel_history_group_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."travel_history" DROP CONSTRAINT "travel_history_itinerary_id_fkey";

-- DropIndex
DROP INDEX "public"."travel_history_group_id_user_id_itinerary_id_key";

-- AlterTable
ALTER TABLE "public"."travel_history" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 year',
ALTER COLUMN "group_id" DROP NOT NULL,
ALTER COLUMN "itinerary_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE SET NULL ON UPDATE CASCADE;
