/*
  Warnings:

  - You are about to drop the `_Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_Like" DROP CONSTRAINT "_Like_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_Like" DROP CONSTRAINT "_Like_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."interactions" DROP CONSTRAINT "interactions_user_id_fkey";

-- DropTable
DROP TABLE "public"."_Like";

-- DropTable
DROP TABLE "public"."interactions";

-- CreateTable
CREATE TABLE "like_blog" (
    "like_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "like_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "like_blog_pkey" PRIMARY KEY ("like_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "like_blog_user_id_blog_id_key" ON "like_blog"("user_id", "blog_id");

-- AddForeignKey
ALTER TABLE "like_blog" ADD CONSTRAINT "like_blog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_blog" ADD CONSTRAINT "like_blog_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE;
