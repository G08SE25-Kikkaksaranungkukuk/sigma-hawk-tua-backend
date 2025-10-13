-- CreateTable
CREATE TABLE "public"."travel_history" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "itinerary_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "travel_history_group_id_user_id_itinerary_id_key" ON "public"."travel_history"("group_id", "user_id", "itinerary_id");

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."travel_history" ADD CONSTRAINT "travel_history_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE CASCADE ON UPDATE CASCADE;
