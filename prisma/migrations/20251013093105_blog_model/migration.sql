-- CreateTable
CREATE TABLE "blogs" (
    "blog_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "json_config" TEXT NOT NULL,
    "html_output" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("blog_id")
);

-- CreateTable
CREATE TABLE "_Like" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Like_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_user_id_key" ON "blogs"("user_id");

-- CreateIndex
CREATE INDEX "_Like_B_index" ON "_Like"("B");

-- AddForeignKey
ALTER TABLE "_Like" ADD CONSTRAINT "_Like_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Like" ADD CONSTRAINT "_Like_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
