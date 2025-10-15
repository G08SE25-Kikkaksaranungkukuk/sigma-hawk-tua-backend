-- DropIndex
DROP INDEX "public"."blogs_user_id_key";

-- CreateTable
CREATE TABLE "blog_interests" (
    "id" SERIAL NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_interests_blog_id_interest_id_key" ON "blog_interests"("blog_id", "interest_id");

-- AddForeignKey
ALTER TABLE "blog_interests" ADD CONSTRAINT "blog_interests_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_interests" ADD CONSTRAINT "blog_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
