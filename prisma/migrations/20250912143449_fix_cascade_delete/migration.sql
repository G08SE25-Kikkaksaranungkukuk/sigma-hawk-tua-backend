-- DropForeignKey
ALTER TABLE "public"."groups" DROP CONSTRAINT "groups_group_leader_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_group_leader_id_fkey" FOREIGN KEY ("group_leader_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
