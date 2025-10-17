import { AppError } from "@/types/error/AppError";
import axios from "axios";
import { config } from "@/config/config";
import { blogCreateReq } from "@/types/blog/blogRequest";
import { prisma } from "@/config/prismaClient";
import { Blog } from "@/prisma/index";

export class BlogRepository {
    async uploadMedia(
        image: Express.Multer.File | undefined
    ): Promise<string> {
        if (!image) throw new AppError("Image is not uploaded", 400);
        const f = image.originalname.split(".");
        const uploadPath = `/public/blog/media/${f.at(0)}_${Date.now()}.${f.at(-1)}`;
        const ret = await axios.put(
            config.FILE_SERVER_URL + uploadPath,
            image.buffer
        );
        return uploadPath
    }

    async createBlog(
        user_id : number,
        dat : blogCreateReq
    ) : Promise<number> {
        const ret = await prisma.blog.create({
            data : {
                'user_id' : user_id,
                ...dat
            }
        })
        return ret.blog_id
    }

    async getMyBlog(
        user_id : number | undefined
    ) : Promise<Blog[]> {
        const ret = await prisma.blog.findMany({
            where : {
                "user_id" : user_id
            }
        })
        return ret
    }

    async getBlogManifest(
        user_id : number,
        blog_id : string
    ) : Promise<Blog> {
        const blogData = await prisma.blog.findFirstOrThrow({
            where : {
                "blog_id" : Number(blog_id),
                "user_id" : user_id
            }
        })
        return blogData
    }

    async updateBlog(
        user_id : number,
        blog_id : string,
        dat : blogCreateReq
    ) : Promise<Blog> {
        
        await prisma.blog.findFirstOrThrow({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })
        
        const blogData = await prisma.blog.update({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            },
            data : dat
        })

        return blogData
    }

    async deleteBlog(user_id : number , blog_id : string) : Promise<void> {
        await prisma.blog.findFirstOrThrow({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })

        await prisma.blog.delete({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })
    }

    async getBlogContent(blog_id : string) : Promise<string> {
        const ret = await prisma.blog.findFirstOrThrow({
            where : {
                "blog_id" : Number(blog_id)
            }
        })
        return ret.html_output
    }

    async searchBlogs(
        query: string,
        page = 1,
        limit = 10,
        user_id?: number,
        sortBy: "newest" | "oldest" | "most likes" = "newest"
    ): Promise<Blog[]> {
        const q = (query ?? "").trim();

        const where: any = { AND: [] };

        if (typeof user_id === "number") where.AND.push({ user_id });

        where.AND.push({
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ]
        });

        const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1);
        const take = Math.max(limit, 1);

        let orderBy: any;
        switch (sortBy) {
            case "oldest":
                orderBy = { created_at: "asc" };
                break;
            case "most likes":
                // order by number of liked_users (descending)
                orderBy = { _count: { liked_users: "desc" } };
                break;
            case "newest":
            default:
                orderBy = { created_at: "desc" };
        }
        
        const results = await prisma.blog.findMany({
            where,
            skip,
            take,
            orderBy
        });

        return results;
    }
}

