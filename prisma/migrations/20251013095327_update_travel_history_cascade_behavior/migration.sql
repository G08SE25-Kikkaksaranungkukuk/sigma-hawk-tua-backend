-- DropForeignKey
ALTER TABLE "public"."travel_history" DROP CONSTRAINT "travel_history_group_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."travel_history" DROP CONSTRAINT "travel_history_itinerary_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;
